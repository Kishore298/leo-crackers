// Using Brevo's HTTP API (port 443) to completely bypass Render's SMTP block (ports 25, 465, 587, 2525)

const sendBrevoEmail = async (payload) => {
  if (!process.env.EMAIL_PASS) {
    console.warn('⚠️ EMAIL_PASS not set in .env. Emails will be mocked and not actually sent.');
    return null;
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.EMAIL_PASS // Brevo SMTP password acts as the API key
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Brevo API Error: ${JSON.stringify(data)}`);
    }
    return data;
  } catch (error) {
    console.error('Error sending email via Brevo API:', error);
    throw error;
  }
};

const sendOrderConfirmationEmail = async (customerEmail, order, pdfBuffer) => {
  if (!customerEmail) return;

  const senderEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@leocrackers.com';

  const payload = {
    sender: { name: "Leo Crackers", email: senderEmail },
    to: [{ email: customerEmail }],
    subject: `Order Confirmation - ${order.orderNumber}`,
    htmlContent: `
      <h2>Thank you for your order!</h2>
      <p>Your order <strong>${order.orderNumber}</strong> has been successfully placed.</p>
      <p>We have attached your order invoice for your reference.</p>
      <p>We will notify you once your order status changes.</p>
      <p>For any queries, please contact us at <strong>+91 91595 33949</strong>.</p>
      <br/>
      <p>Best Regards,</p>
      <p><strong>Leo Crackers</strong></p>
    `
  };

  if (pdfBuffer) {
    payload.attachment = [
      {
        content: pdfBuffer.toString('base64'),
        name: `Invoice_${order.orderNumber}.pdf`
      }
    ];
  }

  if (!process.env.EMAIL_PASS) {
    console.log(`[MOCK EMAIL] Order Confirmation sent to ${customerEmail} with PDF attachment.`);
    return true;
  }

  try {
    await sendBrevoEmail(payload);
    console.log(`Order confirmation email sent to ${customerEmail} via Brevo HTTP API`);
  } catch (error) {
    console.error('Error sending confirmation email:', error.message);
  }
};

const sendStatusUpdateEmail = async (customerEmail, order) => {
  if (!customerEmail) return;

  let statusMessage = '';
  switch (order.status) {
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

  const senderEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@leocrackers.com';

  const payload = {
    sender: { name: "Leo Crackers", email: senderEmail },
    to: [{ email: customerEmail }],
    subject: `Order Status Update - ${order.orderNumber}`,
    htmlContent: `
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

  if (!process.env.EMAIL_PASS) {
    console.log(`[MOCK EMAIL] Status Update (${order.status}) sent to ${customerEmail}.`);
    return true;
  }

  try {
    await sendBrevoEmail(payload);
    console.log(`Status update email sent to ${customerEmail} via Brevo HTTP API`);
  } catch (error) {
    console.error('Error sending status update email:', error.message);
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendStatusUpdateEmail
};
