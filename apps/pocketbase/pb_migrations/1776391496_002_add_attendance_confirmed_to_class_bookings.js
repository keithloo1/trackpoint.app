/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("class_bookings");

  const existing = collection.fields.getByName("attendance_confirmed");
  if (existing) {
    if (existing.type === "bool") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("attendance_confirmed"); // exists with wrong type, remove first
  }

  collection.fields.add(new BoolField({
    name: "attendance_confirmed",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("class_bookings");
    collection.fields.removeByName("attendance_confirmed");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})
