const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ EMAIL_USER or EMAIL_PASS not set in .env. Emails will be mocked and not actually sent.');
    return null;
  }
  
  return nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendOrderConfirmationEmail = async (customerEmail, order, pdfBuffer) => {
  if (!customerEmail) return;

  const transporter = createTransporter();
  const mailOptions = {
    from: `"Leo Crackers" <${process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@leocrackers.com'}>`,
    to: customerEmail,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
      <h2>Thank you for your order!</h2>
      <p>Your order <strong>${order.orderNumber}</strong> has been successfully placed.</p>
      <p>We have attached your order invoice for your reference.</p>
      <p>We will notify you once your order status changes.</p>
      <p>For any queries, please contact us at <strong>+91 91595 33949</strong>.</p>
      <br/>
      <p>Best Regards,</p>
      <p><strong>Leo Crackers Team</strong></p>
    `,
    attachments: [
      {
        filename: `Invoice_${order.orderNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  };

  if (!transporter) {
    console.log(`[MOCK EMAIL] Order Confirmation sent to ${customerEmail} with PDF attachment.`);
    return true;
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${customerEmail}`);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

const sendStatusUpdateEmail = async (customerEmail, order) => {
  if (!customerEmail) return;

  const transporter = createTransporter();
  let statusMessage = '';
  
  switch(order.status) {
    case 'APPROVED':
      statusMessage = 'has been <strong>APPROVED</strong> and is being processed for shipping.';
      break;
    case 'REJECTED':
      statusMessage = 'has been <strong>REJECTED</strong>.';
      break;
    case 'REJECTED_OUT_OF_STOCK':
      statusMessage = 'has been <strong>REJECTED</strong> due to items being out of stock.';
      break;
    default:
      statusMessage = `status has been updated to: <strong>${order.status}</strong>.`;
  }

  const mailOptions = {
    from: `"Leo Crackers" <${process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@leocrackers.com'}>`,
    to: customerEmail,
    subject: `Order Status Update - ${order.orderNumber}`,
    html: `
      <h2>Order Status Update</h2>
      <p>Hello,</p>
      <p>This is to inform you that your order <strong>${order.orderNumber}</strong> ${statusMessage}</p>
      ${order.adminRemarks ? `<p><strong>Admin Note:</strong> ${order.adminRemarks}</p>` : ''}
      <br/>
      <p>If you have any questions, please contact us at <strong>+91 91595 33949</strong>.</p>
      <p>Best Regards,</p>
      <p><strong>Leo Crackers Team</strong></p>
    `
  };

  if (!transporter) {
    console.log(`[MOCK EMAIL] Status Update (${order.status}) sent to ${customerEmail}.`);
    return true;
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Status update email sent to ${customerEmail}`);
  } catch (error) {
    console.error('Error sending status update email:', error);
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendStatusUpdateEmail
};
