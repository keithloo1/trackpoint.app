/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("exercises");
  collection.indexes.push("CREATE INDEX idx_exercises_bodyPart ON exercises (bodyPart)");
  collection.indexes.push("CREATE INDEX idx_exercises_equipment ON exercises (equipment)");
  collection.indexes.push("CREATE INDEX idx_exercises_difficulty ON exercises (difficulty)");
  collection.indexes.push("CREATE INDEX idx_exercises_mechanic ON exercises (mechanic)");
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("exercises");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_exercises_bodyPart"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_exercises_equipment"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_exercises_difficulty"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_exercises_mechanic"));
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})
