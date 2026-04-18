/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  try {
    const actionType = e.record.get("actionType");
    
    // Only process 'addition' action type
    if (actionType !== "addition") {
      e.next();
      return;
    }
    
    const clientId = e.record.get("clientId");
    const userId = e.record.get("userId");
    const sessionsChanged = e.record.get("sessionsChanged");
    const actionDate = e.record.get("actionDate");
    
    // Fetch client record
    const client = $app.findRecordById("clients", clientId);
    if (!client) {
      console.log("Client not found for addition email: " + clientId);
      e.next();
      return;
    }
    
    // Fetch settings record
    const settings = $app.findFirstRecordByData("settings", "ownerId", userId);
    if (!settings) {
      console.log("Settings not found for addition email: " + userId);
      e.next();
      return;
    }
    
    const clientName = client.get("clientName");
    const clientEmail = client.get("email");
    const sessionsRemaining = client.get("sessionsRemaining");
    const totalSessions = client.get("totalSessions");
    const expiryDate = client.get("expiryDate");
    
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: clientEmail }],
      subject: "Sessions Added - " + clientName,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #28a745;">
            <h2 style="color: #155724; margin-top: 0;">Sessions Added to Your Account</h2>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p style="color: #555; font-size: 16px;">Dear <strong>${clientName}</strong>,</p>
            <p style="color: #555; font-size: 14px;">Great news! Additional sessions have been added to your package. Here are the details:</p>
          </div>
          
          <div style="background-color: #f0f4f8; padding: 15px; border-left: 4px solid #28a745; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold; width: 50%;">Addition Date:</td>
                <td style="padding: 8px 0; color: #333;">${actionDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Sessions Added:</td>
                <td style="padding: 8px 0; color: #28a745; font-weight: bold;">+${sessionsChanged}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Sessions Remaining:</td>
                <td style="padding: 8px 0; color: #333;"><strong>${sessionsRemaining}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Total Sessions:</td>
                <td style="padding: 8px 0; color: #333;">${totalSessions}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Package Expiry Date:</td>
                <td style="padding: 8px 0; color: #333;">${expiryDate}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #e7f3ff; padding: 12px; border-radius: 4px; margin-bottom: 20px; border-left: 4px solid #0066cc;">
            <p style="color: #004085; margin: 0; font-size: 14px;">
              <strong>Thank you!</strong> We appreciate your continued business. Make the most of your sessions before the expiry date.
            </p>
          </div>
          
          <div style="color: #999; font-size: 12px; border-top: 1px solid #ddd; padding-top: 15px;">
            <p style="margin: 5px 0;">This is an automated email. Please do not reply to this message.</p>
            <p style="margin: 5px 0;">If you have any questions, please contact your service provider.</p>
          </div>
        </div>
      `
    });
    
    $app.newMailClient().send(message);
  } catch (error) {
    console.log("Error sending session addition email: " + error.message);
  }
  
  e.next();
}, "history");