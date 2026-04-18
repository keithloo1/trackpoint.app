/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("users");

  const existing = collection.fields.getByName("receiptEmailEnabled");
  if (existing) {
    if (existing.type === "bool") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("receiptEmailEnabled"); // exists with wrong type, remove first
  }

  collection.fields.add(new BoolField({
    name: "receiptEmailEnabled",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("users");
  collection.fields.removeByName("receiptEmailEnabled");
  return app.save(collection);
})
