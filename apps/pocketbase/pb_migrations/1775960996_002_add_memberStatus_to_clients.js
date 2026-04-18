/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("clients");

  const existing = collection.fields.getByName("memberStatus");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("memberStatus"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "memberStatus",
    required: false,
    values: ["member", "non-member"]
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("clients");
  collection.fields.removeByName("memberStatus");
  return app.save(collection);
})
