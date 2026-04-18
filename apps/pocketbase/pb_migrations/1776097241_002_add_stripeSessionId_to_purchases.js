/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("purchases");

  const existing = collection.fields.getByName("stripeSessionId");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("stripeSessionId"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "stripeSessionId",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("purchases");
  collection.fields.removeByName("stripeSessionId");
  return app.save(collection);
})
