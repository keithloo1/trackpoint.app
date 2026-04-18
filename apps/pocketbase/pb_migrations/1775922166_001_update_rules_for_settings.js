/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("settings");
  collection.listRule = "ownerId = @request.auth.id";
  collection.viewRule = "ownerId = @request.auth.id";
  collection.createRule = "@request.auth.id != ''";
  collection.updateRule = "ownerId = @request.auth.id";
  collection.deleteRule = "ownerId = @request.auth.id";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("settings");
  collection.listRule = "ownerId = @request.auth.id";
  collection.viewRule = "ownerId = @request.auth.id";
  collection.createRule = "@request.auth.id != ''";
  collection.updateRule = "ownerId = @request.auth.id";
  collection.deleteRule = "ownerId = @request.auth.id";
  return app.save(collection);
})
