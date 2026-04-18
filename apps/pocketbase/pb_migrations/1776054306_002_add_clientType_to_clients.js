/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("clients");

  const existing = collection.fields.getByName("clientType");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("clientType"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "clientType",
    required: true,
    values: ["PT", "Group", "PT and Group"]
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("clients");
  collection.fields.removeByName("clientType");
  return app.save(collection);
})
