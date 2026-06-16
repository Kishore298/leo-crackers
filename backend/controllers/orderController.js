const Order = require('../models/Order');
const Customer = require('../models/Customer');

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

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, {
      ...(req.body.status && { status: req.body.status }),
      ...(req.body.paymentStatus && { paymentStatus: req.body.paymentStatus }),
      ...(req.body.adminRemarks && { adminRemarks: req.body.adminRemarks }),
    }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
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
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: 'Order creation failed', error: error.message });
  }
};

module.exports = { getOrders, updateOrderStatus, createOrder };