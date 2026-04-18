/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("clients");

  const existing = collection.fields.getByName("unlimited");
  if (existing) {
    if (existing.type === "bool") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("unlimited"); // exists with wrong type, remove first
  }

  collection.fields.add(new BoolField({
    name: "unlimited",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("clients");
  collection.fields.removeByName("unlimited");
  return app.save(collection);
})
