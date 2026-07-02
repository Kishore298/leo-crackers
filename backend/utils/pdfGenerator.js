const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

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

      // Load font
      const fontPath = path.join(__dirname, '../assets/fonts/GreatVibes-Regular.ttf');
      if (fs.existsSync(fontPath)) {
        doc.registerFont('BrandFont', fontPath);
      }

      // Load Images
      const logoPath = path.join(__dirname, '../../user-frontend-next/public/assets/leo-logo.png');
      const deityPath = path.join(__dirname, '../../user-frontend-next/public/assets/hero-deity.jpeg');

      let currentY = 40;

      if (fs.existsSync(deityPath)) {
        doc.image(deityPath, (doc.page.width - 60) / 2, currentY, { width: 60 });
      }

      currentY += 75; // Space below images

      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, (doc.page.width / 2) - 130, currentY - 5, { width: 40 });
      }

      // Header Text
      if (fs.existsSync(fontPath)) {
        doc.font('BrandFont');
      } else {
        doc.font('Helvetica-Bold');
      }

      doc.fillColor('#D90429')
         .fontSize(36)
         .text('Leo Crackers', 0, currentY, { align: 'center', width: doc.page.width });
         
      doc.font('Helvetica')
         .fillColor('#444444')
         .fontSize(10)
         .text('Premium Quality Crackers | Sivakasi', { align: 'center' })
         .text('www.leocrackers.com | Phone: +91 91595 33949', { align: 'center' })
         .moveDown(4);

      // Order Info
      // Order Info
      doc.fontSize(14).fillColor('#000000').text('Order Invoice', 81, doc.y, { underline: true });
      doc.fontSize(10).moveDown();
      doc.text(`Order Number: ${order.orderNumber}`, 81, doc.y);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 81, doc.y);
      doc.text(`Payment Status: ${order.paymentStatus}`, 81, doc.y);
      doc.moveDown();

      // Customer Info
      doc.text(`Customer Name: ${customer.customerName}`, 81, doc.y);
      doc.text(`Email: ${customer.email || 'N/A'}`, 81, doc.y);
      doc.text(`Mobile: ${customer.mobileNumber}`, 81, doc.y);
      doc.text(`Address: ${customer.address}, ${customer.city} - ${customer.pincode}`, 81, doc.y);
      doc.moveDown(2);

      // Table Header
      const tableTop = doc.y;
      doc.font('Helvetica-Bold');
      doc.text('Item', 81, tableTop);
      doc.text('Qty', 331, tableTop, { width: 50, align: 'right' });
      doc.text('Price', 381, tableTop, { width: 70, align: 'right' });
      doc.text('Total', 451, tableTop, { width: 80, align: 'right' });
      
      doc.moveTo(81, tableTop + 15).lineTo(531, tableTop + 15).stroke();
      doc.font('Helvetica');

      // Table Body
      let y = tableTop + 20;
      order.items.forEach(item => {
        const itemTotal = item.quantity * item.priceAtPurchase;
        // Check if product is populated (has name), otherwise fallback
        const productName = item.product && item.product.name ? item.product.name : 'Product';
        
        doc.text(productName, 81, y);
        doc.text(item.quantity.toString(), 331, y, { width: 50, align: 'right' });
        doc.text(`Rs. ${item.priceAtPurchase}`, 381, y, { width: 70, align: 'right' });
        doc.text(`Rs. ${itemTotal}`, 451, y, { width: 80, align: 'right' });
        y += 20;
      });

      doc.moveTo(81, y).lineTo(531, y).stroke();
      y += 10;

      // Totals
      // Totals
      doc.font('Helvetica-Bold');
      doc.text('Subtotal:', 381, y, { width: 70, align: 'right' });
      doc.text(`Rs. ${order.subtotal}`, 451, y, { width: 80, align: 'right' });
      y += 20;

      if (order.discountAmount > 0) {
        doc.text('Discount:', 381, y, { width: 70, align: 'right' });
        doc.text(`-Rs. ${order.discountAmount}`, 451, y, { width: 80, align: 'right' });
        y += 20;
      }

      doc.text('Final Amount:', 381, y, { width: 70, align: 'right' });
      doc.fillColor('#D90429').text(`Rs. ${order.finalAmount}`, 451, y, { width: 80, align: 'right' });

      // Footer
      doc.font('Helvetica').fillColor('#444444');
      doc.text('Thank You for your order!', 81, y + 50, { align: 'center', width: 450 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateOrderPDF };
