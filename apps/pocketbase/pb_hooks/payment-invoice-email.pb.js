/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  try {
    // Fetch related records
    const payment = e.record;
    const paymentId = payment.id;
    const clientId = payment.get("clientId");
    const userId = payment.get("userId");
    const packageId = payment.get("packageId");
    
    // Fetch client record
    const client = $app.findRecordById("clients", clientId);
    if (!client) {
      console.log("Client not found for payment: " + paymentId);
      e.next();
      return;
    }
    
    // Fetch package record
    const pkg = $app.findRecordById("packages", packageId);
    if (!pkg) {
      console.log("Package not found for payment: " + paymentId);
      e.next();
      return;
    }
    
    // Fetch settings record for gym owner details
    const settings = $app.findFirstRecordByData("settings", "ownerId", userId);
    if (!settings) {
      console.log("Settings not found for user: " + userId);
      e.next();
      return;
    }
    
    // Generate invoice number (format: INV-TIMESTAMP-LAST5CHARS)
    const timestamp = new Date().getTime();
    const invoiceNumber = "INV-" + timestamp + "-" + paymentId.substring(paymentId.length - 5).toUpperCase();
    
    // Get payment details
    const amount = payment.get("amount");
    const sessionsAdded = payment.get("sessionsAdded");
    const paymentDate = payment.get("paymentDate");
    const paymentTime = payment.get("paymentTime") || "Not specified";
    
    // Calculate new expiry date (add 365 days from today)
    const today = new Date();
    const expiryDate = new Date(today.getTime() + (365 * 24 * 60 * 60 * 1000));
    const expiryDateFormatted = expiryDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    
    // Format payment date
    const paymentDateFormatted = new Date(paymentDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    
    // Get client and gym owner details
    const clientName = client.get("clientName");
    const clientEmail = client.get("email");
    const packageName = pkg.get("packageName");
    const businessName = settings.get("businessName") || "Gym";
    const receiptEmail = settings.get("receiptEmail");
    const receiptEmailEnabled = settings.get("receiptEmailEnabled");
    
    // Create professional HTML invoice
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2c3e50; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .header p { margin: 5px 0 0 0; font-size: 14px; }
          .invoice-details { background-color: #ecf0f1; padding: 15px; border-bottom: 2px solid #2c3e50; }
          .invoice-details table { width: 100%; font-size: 13px; }
          .invoice-details td { padding: 5px 0; }
          .invoice-details .label { font-weight: bold; width: 40%; }
          .content { padding: 20px; background-color: #fff; }
          .section { margin-bottom: 20px; }
          .section-title { font-weight: bold; font-size: 14px; color: #2c3e50; border-bottom: 1px solid #bdc3c7; padding-bottom: 8px; margin-bottom: 10px; }
          .details-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          .details-table th { background-color: #34495e; color: white; padding: 10px; text-align: left; font-size: 13px; }
          .details-table td { padding: 10px; border-bottom: 1px solid #ecf0f1; font-size: 13px; }
          .details-table tr:last-child td { border-bottom: none; }
          .total-section { background-color: #ecf0f1; padding: 15px; border-radius: 5px; margin-top: 15px; }
          .total-row { display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; color: #2c3e50; }
          .footer { background-color: #34495e; color: white; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 5px 5px; }
          .footer p { margin: 5px 0; }
          .highlight { color: #27ae60; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>INVOICE</h1>
            <p>` + businessName + `</p>
          </div>
          
          <div class="invoice-details">
            <table>
              <tr>
                <td class="label">Invoice Number:</td>
                <td>` + invoiceNumber + `</td>
              </tr>
              <tr>
                <td class="label">Invoice Date:</td>
                <td>` + paymentDateFormatted + `</td>
              </tr>
              <tr>
                <td class="label">Transaction Time:</td>
                <td>` + paymentTime + `</td>
              </tr>
            </table>
          </div>
          
          <div class="content">
            <div class="section">
              <div class="section-title">BILL TO</div>
              <p>
                <strong>` + clientName + `</strong><br>
                Email: ` + clientEmail + `
              </p>
            </div>
            
            <div class="section">
              <div class="section-title">PACKAGE DETAILS</div>
              <table class="details-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style="text-align: right;">Sessions</th>
                    <th style="text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>` + packageName + `</td>
                    <td style="text-align: right;">` + sessionsAdded + `</td>
                    <td style="text-align: right;">$` + amount.toFixed(2) + `</td>
                  </tr>
                </tbody>
              </table>
              
              <div class="total-section">
                <div class="total-row">
                  <span>Total Amount Paid:</span>
                  <span class="highlight">$` + amount.toFixed(2) + `</span>
                </div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">MEMBERSHIP DETAILS</div>
              <table>
                <tr>
                  <td style="width: 50%; padding: 8px 0;"><strong>Sessions Added:</strong></td>
                  <td style="padding: 8px 0;">` + sessionsAdded + `</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>New Expiry Date:</strong></td>
                  <td style="padding: 8px 0; color: #27ae60; font-weight: bold;">` + expiryDateFormatted + `</td>
                </tr>
              </table>
            </div>
            
            <div class="section">
              <p style="font-size: 12px; color: #7f8c8d; margin: 0;">
                Thank you for your purchase! Your membership has been updated with the new sessions. 
                Please keep this invoice for your records.
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>` + businessName + `</strong></p>
            <p>Thank you for your business!</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Send invoice to client
    const clientMessage = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: businessName
      },
      to: [{ address: clientEmail }],
      subject: "Invoice #" + invoiceNumber + " - " + businessName,
      html: invoiceHTML
    });
    
    $app.newMailClient().send(clientMessage);
    console.log("Invoice email sent to client: " + clientEmail);
    
    // Send copy to gym owner if enabled
    if (receiptEmailEnabled && receiptEmail) {
      const ownerMessage = new MailerMessage({
        from: {
          address: $app.settings().meta.senderAddress,
          name: businessName
        },
        to: [{ address: receiptEmail }],
        subject: "Invoice Copy #" + invoiceNumber + " - " + clientName,
        html: invoiceHTML
      });
      
      $app.newMailClient().send(ownerMessage);
      console.log("Invoice copy sent to owner: " + receiptEmail);
    }
    
    e.next();
  } catch (error) {
    console.log("Error in payment-invoice-email hook: " + error.message);
    e.next();
  }
}, "payments");