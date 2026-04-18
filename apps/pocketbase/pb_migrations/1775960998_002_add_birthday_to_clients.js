/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("clients");

  const existing = collection.fields.getByName("birthday");
  if (existing) {
    if (existing.type === "date") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("birthday"); // exists with wrong type, remove first
  }

  collection.fields.add(new DateField({
    name: "birthday",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("clients");
  collection.fields.removeByName("birthday");
  return app.save(collection);
})
