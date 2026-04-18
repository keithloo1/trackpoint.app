/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  try {
    const clientId = e.record.get("clientId");
    const userId = e.record.get("userId");
    const sessionsDeducted = e.record.get("sessionsDeducted");
    const deductionDate = e.record.get("deductionDate");
    
    // Fetch client record
    const client = $app.findRecordById("clients", clientId);
    if (!client) {
      console.log("Client not found for deduction email: " + clientId);
      e.next();
      return;
    }
    
    // Fetch settings record
    const settings = $app.findFirstRecordByData("settings", "ownerId", userId);
    if (!settings) {
      console.log("Settings not found for deduction email: " + userId);
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
      subject: "Session Deducted - " + clientName,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Session Deduction Notification</h2>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p style="color: #555; font-size: 16px;">Dear <strong>${clientName}</strong>,</p>
            <p style="color: #555; font-size: 14px;">A session has been deducted from your package. Here are the details:</p>
          </div>
          
          <div style="background-color: #f0f4f8; padding: 15px; border-left: 4px solid #007bff; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold; width: 50%;">Deduction Date:</td>
                <td style="padding: 8px 0; color: #333;">${deductionDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Sessions Deducted:</td>
                <td style="padding: 8px 0; color: #333;">${sessionsDeducted}</td>
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
          
          <div style="background-color: #fff3cd; padding: 12px; border-radius: 4px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Note:</strong> Please ensure you have sufficient sessions remaining before your package expiry date.
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
    console.log("Error sending session deduction email: " + error.message);
  }
  
  e.next();
}, "session_deductions");