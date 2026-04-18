/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("users");

  const existing = collection.fields.getByName("receiptEmail");
  if (existing) {
    if (existing.type === "email") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("receiptEmail"); // exists with wrong type, remove first
  }

  collection.fields.add(new EmailField({
    name: "receiptEmail",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("users");
  collection.fields.removeByName("receiptEmail");
  return app.save(collection);
})
