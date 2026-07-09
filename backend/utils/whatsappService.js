const sendWhatsAppMessage = async (mobileNumber, templateName, components = []) => {
  if (!process.env.WHATSAPP_PHONE_NUMBER_ID || !process.env.WHATSAPP_ACCESS_TOKEN) {
    console.warn(`[MOCK WHATSAPP] Message template '${templateName}' would be sent to ${mobileNumber}`);
    return;
  }

  // Ensure Indian country code if missing
  let formattedNumber = mobileNumber.toString().replace(/\D/g, '');
  if (formattedNumber.length === 10) {
    formattedNumber = '91' + formattedNumber;
  }

  const payload = {
    messaging_product: "whatsapp",
    to: formattedNumber,
    type: "template",
    template: {
      name: templateName,
      language: {
        code: "en"
      },
      components: components
    }
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error(`WhatsApp API Error (${templateName}):`, data);
    } else {
      console.log(`WhatsApp template '${templateName}' sent to ${formattedNumber}`);
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
};

const uploadMediaToWhatsApp = async (fileBuffer, filename, mimeType) => {
  if (!process.env.WHATSAPP_PHONE_NUMBER_ID || !process.env.WHATSAPP_ACCESS_TOKEN) return 'mock_media_id';

  try {
    const formData = new FormData();
    formData.append('messaging_product', 'whatsapp');
    formData.append('file', new Blob([fileBuffer], { type: mimeType }), filename);

    const response = await fetch(
      `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/media`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`
        },
        body: formData
      }
    );

    const data = await response.json();
    if (!response.ok) {
      console.error('WhatsApp Media Upload Error:', data);
      return null;
    }
    return data.id;
  } catch (error) {
    console.error('Error uploading media to WhatsApp:', error);
    return null;
  }
};

const sendWhatsAppOrderConfirmation = async (mobileNumber, order, pdfBuffer) => {
  if (!mobileNumber) return;

  const components = [
    {
      type: "body",
      parameters: [
        { type: "text", text: order.customer?.customerName || 'Customer' },
        { type: "text", text: order.orderNumber }
      ]
    }
  ];

  if (pdfBuffer) {
    const mediaId = await uploadMediaToWhatsApp(pdfBuffer, `Invoice_${order.orderNumber}.pdf`, 'application/pdf');
    if (mediaId) {
      // Add the document header component if upload succeeds
      components.unshift({
        type: "header",
        parameters: [
          {
            type: "document",
            document: {
              id: mediaId,
              filename: `Invoice_${order.orderNumber}.pdf`
            }
          }
        ]
      });
    }
  }

  // Using environment variable for template name with fallback
  const templateName = process.env.WHATSAPP_TEMPLATE_ORDER_CONFIRMATION || 'order_confirmation';

  await sendWhatsAppMessage(mobileNumber, templateName, components);
};

const sendWhatsAppStatusUpdate = async (mobileNumber, order) => {
  if (!mobileNumber) return;

  // Assuming template 'order_status_update' with 2 variables: {{1}} Order Number, {{2}} New Status
  const components = [
    {
      type: "body",
      parameters: [
        { type: "text", text: order.orderNumber },
        { type: "text", text: order.status }
      ]
    }
  ];

  // Using environment variable for template name with fallback
  const templateName = process.env.WHATSAPP_TEMPLATE_STATUS_UPDATE || 'order_status_update';

  await sendWhatsAppMessage(mobileNumber, templateName, components);
};

module.exports = {
  sendWhatsAppOrderConfirmation,
  sendWhatsAppStatusUpdate
};
