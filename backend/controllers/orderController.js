const Order = require('../models/Order');
const Customer = require('../models/Customer');
const { generateOrderPDF } = require('../utils/pdfGenerator');
const { sendOrderConfirmationEmail, sendStatusUpdateEmail } = require('../utils/emailService');
const { sendWhatsAppOrderConfirmation, sendWhatsAppStatusUpdate } = require('../utils/whatsappService');
const { sendAdminPushNotification } = require('../services/firebaseService');

// Admin - get orders with filter, sort, pagination
const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'PENDING' });
    const approvedOrders = await Order.find({ status: 'APPROVED' }).select('finalAmount');
    const totalRevenue = approvedOrders.reduce((acc, o) => acc + (o.finalAmount || 0), 0);
    const recentOrders = await Order.find().populate('customer').sort({ createdAt: -1 }).limit(10);
    
    res.json({ totalOrders, pendingOrders, totalRevenue, recentOrders });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin - get orders with filter, sort, pagination
const getOrders = async (req, res) => {
  try {
    const { status, paymentStatus, search, sortBy = 'createdAt', order = 'desc', page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    // If searching by order number or customer name, do a lookup
    let customerIds = [];
    if (search) {
      filter.$or = [{ orderNumber: { $regex: search, $options: 'i' } }];
      const customers = await Customer.find({ customerName: { $regex: search, $options: 'i' } }).select('_id');
      if (customers.length) {
        filter.$or.push({ customer: { $in: customers.map(c => c._id) } });
      }
    }

    const sort = { [sortBy]: order === 'asc' ? 1 : -1 };
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter).populate('customer').populate('items.product', 'name').sort(sort).skip(skip).limit(Number(limit)),
      Order.countDocuments(filter)
    ]);
    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// update order status by admin
const updateOrderStatus = async (req, res) => {
  try {
    const originalOrder = await Order.findById(req.params.id);
    if (!originalOrder) return res.status(404).json({ message: 'Order not found' });
    
    const isStatusChanged = req.body.status && originalOrder.status !== req.body.status;

    const order = await Order.findByIdAndUpdate(req.params.id, {
      ...(req.body.status && { status: req.body.status }),
      ...(req.body.paymentStatus && { paymentStatus: req.body.paymentStatus }),
      ...(req.body.adminRemarks && { adminRemarks: req.body.adminRemarks }),
    }, { returnDocument: 'after' }).populate('customer');

    if (isStatusChanged && order.customer && order.customer.email) {
      // fire and forget email update
      sendStatusUpdateEmail(order.customer.email, order).catch(console.error);
    }

    if (isStatusChanged && order.customer && order.customer.mobileNumber) {
      // fire and forget whatsapp update
      sendWhatsAppStatusUpdate(order.customer.mobileNumber, order).catch(console.error);
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: 'Update failed', error });
  }
};

// Public - create order
const createOrder = async (req, res) => {
  try {
    const { customerData, orderItems, subtotal, globalDiscountPercentage, discountAmount, finalAmount } = req.body;

    let customer = await Customer.findOne({ mobileNumber: customerData.mobileNumber });
    if (!customer) {
      customer = await Customer.create(customerData);
    } else {
      Object.assign(customer, customerData);
      await customer.save();
    }

    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${orderCount + 1}`;

    const order = new Order({
      orderNumber,
      customer: customer._id,
      items: orderItems,
      subtotal: subtotal || 0,
      globalDiscountPercentage: globalDiscountPercentage || 0,
      discountAmount: discountAmount || 0,
      finalAmount: finalAmount || subtotal || 0,
    });

    const createdOrder = await order.save();

    if (customer.email || customer.mobileNumber) {
       const populatedOrder = await Order.findById(createdOrder._id).populate('items.product', 'name');
       generateOrderPDF(populatedOrder, customer)
         .then(pdfBuffer => {
            if (customer.email) {
                sendOrderConfirmationEmail(customer.email, populatedOrder, pdfBuffer)
                  .catch(err => console.error('Error in order email generation:', err));
            }
            if (customer.mobileNumber) {
                sendWhatsAppOrderConfirmation(customer.mobileNumber, populatedOrder, pdfBuffer)
                  .catch(err => console.error('Error sending WhatsApp order confirmation:', err));
            }
         })
         .catch(err => console.error('Error in order PDF generation:', err));
    }

    // Trigger push notification to admins
    sendAdminPushNotification(
      'New Order Received! 🚀',
      `Order ${orderNumber} placed for ₹${finalAmount}`,
      { type: 'NEW_ORDER', orderId: createdOrder._id.toString() }
    ).catch(console.error);

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: 'Order creation failed', error: error.message });
  }
};

// Admin - resend order confirmation
const resendOrderConfirmation = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer').populate('items.product', 'name');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (!order.customer.email && !order.customer.mobileNumber) {
      return res.status(400).json({ message: 'Customer has no email or mobile number.' });
    }

    // Acknowledge the request immediately
    res.json({ message: 'Resend request initiated. Processing in background...' });

    // Fire and forget background processing
    (async () => {
      try {
        const pdfBuffer = await generateOrderPDF(order, order.customer);
        
        if (order.customer.email) {
          await sendOrderConfirmationEmail(order.customer.email, order, pdfBuffer);
        }
        
        if (order.customer.mobileNumber) {
          await sendWhatsAppOrderConfirmation(order.customer.mobileNumber, order, pdfBuffer);
        }
      } catch (backgroundError) {
        console.error('Background error during resend confirmation:', backgroundError);
      }
    })();
    
  } catch (error) {
    console.error('Error initiating resend confirmation:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to initiate resend confirmation', error: error.message });
    }
  }
};

module.exports = { getOrders, updateOrderStatus, createOrder, getDashboardStats, resendOrderConfirmation };