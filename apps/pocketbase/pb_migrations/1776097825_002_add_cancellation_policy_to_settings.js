/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("settings");

  const existing = collection.fields.getByName("cancellation_policy");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("cancellation_policy"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "cancellation_policy",
    required: false,
    values: ["Allow cancellations anytime", "Cannot cancel within 24 hours before class", "Cannot cancel within 1 hour before class"]
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("settings");
  collection.fields.removeByName("cancellation_policy");
  return app.save(collection);
})
