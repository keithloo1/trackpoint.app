/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("history");

  const existing = collection.fields.getByName("receiptSentAt");
  if (existing) {
    if (existing.type === "autodate") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("receiptSentAt"); // exists with wrong type, remove first
  }

  collection.fields.add(new AutodateField({
    name: "receiptSentAt",
    onCreate: true,
    onUpdate: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("history");
  collection.fields.removeByName("receiptSentAt");
  return app.save(collection);
})
