/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  try {
    const actionType = e.record.get("actionType");
    
    // Only process 'renewal' action type
    if (actionType !== "renewal") {
      e.next();
      return;
    }
    
    const clientId = e.record.get("clientId");
    const userId = e.record.get("userId");
    const sessionsChanged = e.record.get("sessionsChanged");
    const actionDate = e.record.get("actionDate");
    const amount = e.record.get("amount");
    
    // Fetch client record
    const client = $app.findRecordById("clients", clientId);
    if (!client) {
      console.log("Client not found for renewal email: " + clientId);
      e.next();
      return;
    }
    
    // Fetch settings record
    const settings = $app.findFirstRecordByData("settings", "ownerId", userId);
    if (!settings) {
      console.log("Settings not found for renewal email: " + userId);
      e.next();
      return;
    }
    
    const clientName = client.get("clientName");
    const clientEmail = client.get("email");
    const totalSessions = client.get("totalSessions");
    const expiryDate = client.get("expiryDate");
    
    let amountHtml = "";
    if (amount) {
      amountHtml = `
        <tr>
          <td style="padding: 8px 0; color: #666; font-weight: bold;">Amount Paid:</td>
          <td style="padding: 8px 0; color: #333;">$${amount}</td>
        </tr>
      `;
    }
    
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: clientEmail }],
      subject: "Package Renewed - Receipt",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1a73e8; padding: 20px; border-radius: 8px 8px 0 0; margin-bottom: 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Package Renewal Receipt</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; margin-bottom: 20px;">
            <p style="color: #555; font-size: 16px; margin: 0 0 10px 0;">Dear <strong>${clientName}</strong>,</p>
            <p style="color: #666; font-size: 14px; margin: 0;">Thank you for renewing your package! Your subscription has been successfully renewed.</p>
          </div>
          
          <div style="background-color: #ffffff; border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1a73e8; margin-top: 0; border-bottom: 2px solid #1a73e8; padding-bottom: 10px;">Renewal Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold; width: 50%;">Renewal Date:</td>
                <td style="padding: 10px 0; color: #333;">${actionDate}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">New Total Sessions:</td>
                <td style="padding: 10px 0; color: #333;"><strong>${totalSessions}</strong></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">New Expiry Date:</td>
                <td style="padding: 10px 0; color: #333;"><strong>${expiryDate}</strong></td>
              </tr>
              ${amountHtml}
            </table>
          </div>
          
          <div style="background-color: #e8f5e9; padding: 15px; border-radius: 4px; margin-bottom: 20px; border-left: 4px solid #4caf50;">
            <p style="color: #2e7d32; margin: 0; font-size: 14px;">
              <strong>✓ Renewal Successful</strong><br>
              Your package is now active and ready to use. You have ${totalSessions} sessions available until ${expiryDate}.
            </p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
            <h4 style="color: #333; margin-top: 0;">Important Information:</h4>
            <ul style="color: #666; font-size: 13px; margin: 10px 0; padding-left: 20px;">
              <li>Your sessions are valid until <strong>${expiryDate}</strong></li>
              <li>Unused sessions will expire after the renewal period</li>
              <li>You can track your session usage in your account dashboard</li>
            </ul>
          </div>
          
          <div style="color: #999; font-size: 12px; border-top: 1px solid #ddd; padding-top: 15px;">
            <p style="margin: 5px 0;">This is an automated receipt. Please keep it for your records.</p>
            <p style="margin: 5px 0;">If you have any questions about your renewal, please contact our support team.</p>
          </div>
        </div>
      `
    });
    
    $app.newMailClient().send(message);
  } catch (error) {
    console.log("Error sending renewal email: " + error.message);
  }
  
  e.next();
}, "history");