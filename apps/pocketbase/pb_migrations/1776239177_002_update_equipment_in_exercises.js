/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("exercises");
  const field = collection.fields.getByName("equipment");
  field.values = ["Bodyweight", "Dumbbell", "Barbell", "Kettlebell", "Bands", "Pull-up Bar", "Bench", "Machine", "Cable", "Cardio Equipment"];
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("exercises");
  const field = collection.fields.getByName("equipment");
  if (!field) { console.log("Field not found, skipping revert"); return; }
  field.values = ["Bodyweight", "Dumbbell", "Barbell", "Kettlebell", "Bands", "Pull-up Bar", "Bench"];
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection or field not found, skipping revert");
      return;
    }
    throw e;
  }
})
