/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const classId = e.record.get("classId");
  const clientId = e.record.get("clientId");
  
  // Fetch the class details
  const classRecord = $app.findRecordById("classes", classId);
  const className = classRecord.get("className");
  const classDate = classRecord.get("classDate");
  const classTime = classRecord.get("classTime");
  
  // Fetch the client details
  const clientRecord = $app.findRecordById("clients", clientId);
  const clientName = clientRecord.get("clientName");
  const clientEmail = clientRecord.get("email");
  
  // Send confirmation email
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: clientEmail }],
    subject: "Class Booking Confirmation - " + className,
    html: "<h2>Class Booking Confirmation</h2><p>Hi " + clientName + ",</p><p>Your booking has been confirmed for the following class:</p><ul><li><strong>Class:</strong> " + className + "</li><li><strong>Date:</strong> " + classDate + "</li><li><strong>Time:</strong> " + classTime + "</li></ul><p>Thank you for booking with us!</p>"
  });
  $app.newMailClient().send(message);
  e.next();
}, "class_bookings");