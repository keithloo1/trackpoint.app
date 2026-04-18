/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const status = e.record.get("status");
  
  // Only send confirmation if payment is completed
  if (status === "completed") {
    const clientId = e.record.get("clientId");
    const amount = e.record.get("amount");
    const sessionsAdded = e.record.get("sessionsAdded");
    
    try {
      // Get client details
      const client = $app.findRecordById("clients", clientId);
      if (client) {
        const clientName = client.get("clientName");
        const clientEmail = client.get("email");
        const expiryDate = client.get("expiryDate");
        
        if (clientEmail) {
          const message = new MailerMessage({
            from: {
              address: $app.settings().meta.senderAddress,
              name: $app.settings().meta.senderName
            },
            to: [{ address: clientEmail }],
            subject: "Payment Confirmation - Sessions Added",
            html: "<h1>Payment Confirmation</h1><p>Dear " + clientName + ",</p><p>Thank you for your payment! Your transaction has been successfully processed.</p><h2>Payment Details:</h2><ul><li><strong>Amount Paid:</strong> RM" + amount + "</li><li><strong>Sessions Added:</strong> " + sessionsAdded + " sessions</li><li><strong>New Expiry Date:</strong> " + expiryDate + "</li></ul><p>Your training sessions are now ready to use. You can start booking your sessions immediately.</p><p>If you have any questions or need assistance, please don't hesitate to contact us.</p><p>Thank you for choosing us!</p><p>Best regards,<br>Your Training Team</p>"
          });
          $app.newMailClient().send(message);
        }
      }
    } catch (err) {
      console.log("Error sending payment confirmation: " + err.message);
    }
  }
  
  e.next();
}, "payments");