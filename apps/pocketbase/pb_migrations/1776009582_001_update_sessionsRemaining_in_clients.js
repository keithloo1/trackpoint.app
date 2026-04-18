/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("clients");
  const field = collection.fields.getByName("sessionsRemaining");
  field.required = false;
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("clients");
  const field = collection.fields.getByName("sessionsRemaining");
  field.required = true;
  return app.save(collection);
})
