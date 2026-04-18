/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("packages");

  const record0 = new Record(collection);
    record0.set("packageName", "5 Sessions - RM50");
    record0.set("sessions", 5);
    record0.set("price", 50);
    record0.set("description", "Perfect for getting started with 5 training sessions");
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
    record1.set("packageName", "10 Sessions - RM90");
    record1.set("sessions", 10);
    record1.set("price", 90);
    record1.set("description", "Great value package with 10 training sessions");
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
    record2.set("packageName", "20 Sessions - RM160");
    record2.set("sessions", 20);
    record2.set("price", 160);
    record2.set("description", "Best value package with 20 training sessions");
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    record3.set("packageName", "30 Sessions - RM220");
    record3.set("sessions", 30);
    record3.set("price", 220);
    record3.set("description", "Premium package with 30 training sessions");
  try {
    app.save(record3);
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
