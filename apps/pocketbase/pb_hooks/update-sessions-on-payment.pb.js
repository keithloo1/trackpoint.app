/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  // Only process completed payments
  if (e.record.get("status") !== "completed") {
    e.next();
    return;
  }

  try {
    // Step 1: Get payment details
    const paymentId = e.record.id;
    const clientId = e.record.get("clientId");
    const packageId = e.record.get("packageId");
    const sessionsAdded = e.record.get("sessionsAdded");

    if (!clientId || !packageId) {
      throw new BadRequestError("Payment must have clientId and packageId");
    }

    // Step 2: Fetch package details to verify sessions count
    const packageRecord = $app.findRecordById("packages", packageId);
    if (!packageRecord) {
      throw new BadRequestError("Package not found: " + packageId);
    }
    const packageSessions = packageRecord.get("sessions");

    // Step 3: Fetch client record
    const clientRecord = $app.findRecordById("clients", clientId);
    if (!clientRecord) {
      throw new BadRequestError("Client not found: " + clientId);
    }

    // Step 4: Calculate new sessions remaining
    const currentSessions = clientRecord.get("sessionsRemaining") || 0;
    const newSessionsRemaining = currentSessions + sessionsAdded;

    // Step 5: Update client record with new sessions remaining
    clientRecord.set("sessionsRemaining", newSessionsRemaining);
    $app.save(clientRecord);

  } catch (error) {
    throw new BadRequestError("Failed to update sessions on payment: " + error.message);
  }

  e.next();
}, "payments");