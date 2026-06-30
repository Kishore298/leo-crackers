const PDFDocument = require('pdfkit');

const generateOrderPDF = (order, customer) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc.fillColor('#D90429')
         .fontSize(24)
         .text('Leo Crackers', { align: 'center' });
         
      doc.fillColor('#444444')
         .fontSize(10)
         .text('Premium Quality Crackers | Sivakasi', { align: 'center' })
         .text('www.leocrackers.com | Phone: +91 9876543210', { align: 'center' })
         .moveDown(2);

      // Order Info
      doc.fontSize(14).fillColor('#000000').text('Order Invoice', { underline: true });
      doc.fontSize(10).moveDown();
      doc.text(`Order Number: ${order.orderNumber}`);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
      doc.text(`Payment Status: ${order.paymentStatus}`);
      doc.moveDown();

      // Customer Info
      doc.text(`Customer Name: ${customer.customerName}`);
      doc.text(`Email: ${customer.email || 'N/A'}`);
      doc.text(`Mobile: ${customer.mobileNumber}`);
      doc.text(`Address: ${customer.address}, ${customer.city} - ${customer.pincode}`);
      doc.moveDown(2);

      // Table Header
      const tableTop = doc.y;
      doc.font('Helvetica-Bold');
      doc.text('Item', 50, tableTop);
      doc.text('Qty', 300, tableTop, { width: 50, align: 'right' });
      doc.text('Price', 350, tableTop, { width: 70, align: 'right' });
      doc.text('Total', 420, tableTop, { width: 80, align: 'right' });
      
      doc.moveTo(50, tableTop + 15).lineTo(500, tableTop + 15).stroke();
      doc.font('Helvetica');

      // Table Body
      let y = tableTop + 20;
      order.items.forEach(item => {
        const itemTotal = item.quantity * item.priceAtPurchase;
        // Check if product is populated (has name), otherwise fallback
        const productName = item.product && item.product.name ? item.product.name : 'Product';
        
        doc.text(productName, 50, y);
        doc.text(item.quantity.toString(), 300, y, { width: 50, align: 'right' });
        doc.text(`Rs. ${item.priceAtPurchase}`, 350, y, { width: 70, align: 'right' });
        doc.text(`Rs. ${itemTotal}`, 420, y, { width: 80, align: 'right' });
        y += 20;
      });

      doc.moveTo(50, y).lineTo(500, y).stroke();
      y += 10;

      // Totals
      doc.font('Helvetica-Bold');
      doc.text('Subtotal:', 350, y, { width: 70, align: 'right' });
      doc.text(`Rs. ${order.subtotal}`, 420, y, { width: 80, align: 'right' });
      y += 20;

      if (order.discountAmount > 0) {
        doc.text('Discount:', 350, y, { width: 70, align: 'right' });
        doc.text(`-Rs. ${order.discountAmount}`, 420, y, { width: 80, align: 'right' });
        y += 20;
      }

      doc.text('Final Amount:', 350, y, { width: 70, align: 'right' });
      doc.fillColor('#D90429').text(`Rs. ${order.finalAmount}`, 420, y, { width: 80, align: 'right' });

      // Footer
      doc.font('Helvetica').fillColor('#444444');
      doc.text('Thank You for your order!', 50, y + 50, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateOrderPDF };
