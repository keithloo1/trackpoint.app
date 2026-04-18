/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("clients");

  const record0 = new Record(collection);
    record0.set("clientName", "John Doe");
    record0.set("email", "john@example.com");
    record0.set("phone", "555-0101");
    record0.set("sessionsRemaining", 8);
    record0.set("totalSessions", 10);
    record0.set("expiryDate", "2026-06-30");
    const record0_userIdLookup = app.findFirstRecordByFilter("users", "email='demo@track.com'");
    if (!record0_userIdLookup) { throw new Error("Lookup failed for userId: no record in 'users' matching \"email='demo@track.com'\""); }
    record0.set("userId", record0_userIdLookup.id);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("clientName", "Jane Smith");
    record1.set("email", "jane@example.com");
    record1.set("phone", "555-0102");
    record1.set("sessionsRemaining", 5);
    record1.set("totalSessions", 12);
    record1.set("expiryDate", "2026-05-15");
    const record1_userIdLookup = app.findFirstRecordByFilter("users", "email='demo@track.com'");
    if (!record1_userIdLookup) { throw new Error("Lookup failed for userId: no record in 'users' matching \"email='demo@track.com'\""); }
    record1.set("userId", record1_userIdLookup.id);
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("clientName", "Mike Johnson");
    record2.set("email", "mike@example.com");
    record2.set("phone", "555-0103");
    record2.set("sessionsRemaining", 12);
    record2.set("totalSessions", 12);
    record2.set("expiryDate", "2026-07-31");
    const record2_userIdLookup = app.findFirstRecordByFilter("users", "email='demo@track.com'");
    if (!record2_userIdLookup) { throw new Error("Lookup failed for userId: no record in 'users' matching \"email='demo@track.com'\""); }
    record2.set("userId", record2_userIdLookup.id);
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})
