/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.id != \"\"",
    "fields":     [
          {
                "autogeneratePattern": "[a-z0-9]{15}",
                "hidden": false,
                "id": "text9509471293",
                "max": 15,
                "min": 15,
                "name": "id",
                "pattern": "^[a-z0-9]+$",
                "presentable": false,
                "primaryKey": true,
                "required": true,
                "system": true,
                "type": "text"
          },
          {
                "hidden": false,
                "id": "text9931998196",
                "name": "name",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "text",
                "autogeneratePattern": "",
                "max": 0,
                "min": 0,
                "pattern": ""
          },
          {
                "hidden": false,
                "id": "select2880531405",
                "name": "bodyPart",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "select",
                "maxSelect": 1,
                "values": [
                      "Chest",
                      "Back",
                      "Shoulders",
                      "Biceps",
                      "Triceps",
                      "Quads",
                      "Hamstrings",
                      "Glutes",
                      "Calves",
                      "Core",
                      "Forearms",
                      "Cardio & Full Body"
                ]
          },
          {
                "hidden": false,
                "id": "select6483910671",
                "name": "movementPattern",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "select",
                "maxSelect": 1,
                "values": [
                      "Press",
                      "Fly",
                      "Row",
                      "Curl",
                      "Extension",
                      "Squat",
                      "Lunge",
                      "Deadlift",
                      "Carry",
                      "Rotation",
                      "Lateral Raise",
                      "Shrug",
                      "Pulldown",
                      "Pullup",
                      "Dip",
                      "Crunch",
                      "Plank",
                      "Sprint",
                      "Climb",
                      "Jump"
                ]
          },
          {
                "hidden": false,
                "id": "select7360192181",
                "name": "equipment",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "select",
                "maxSelect": 1,
                "values": [
                      "Barbell",
                      "Dumbbell",
                      "Kettlebell",
                      "Cable",
                      "Machine",
                      "Bodyweight",
                      "Resistance Band",
                      "Medicine Ball",
                      "Smith Machine",
                      "TRX",
                      "Sandbag",
                      "Landmine",
                      "Sliders",
                      "EZ Bar",
                      "Trap Bar"
                ]
          },
          {
                "hidden": false,
                "id": "select3045821574",
                "name": "mechanic",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "select",
                "maxSelect": 1,
                "values": [
                      "Compound",
                      "Isolation"
                ]
          },
          {
                "hidden": false,
                "id": "select2767447266",
                "name": "difficulty",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "select",
                "maxSelect": 1,
                "values": [
                      "Beginner",
                      "Intermediate",
                      "Advanced"
                ]
          },
          {
                "hidden": false,
                "id": "autodate8402955802",
                "name": "created",
                "onCreate": true,
                "onUpdate": false,
                "presentable": false,
                "system": false,
                "type": "autodate"
          },
          {
                "hidden": false,
                "id": "autodate6764430224",
                "name": "updated",
                "onCreate": true,
                "onUpdate": true,
                "presentable": false,
                "system": false,
                "type": "autodate"
          }
    ],
    "id": "pbc_4318451124",
    "indexes": [],
    "listRule": "",
    "name": "exercises",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.id != \"\"",
    "viewRule": ""
  });

  try {
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("Collection name must be unique")) {
      console.log("Collection already exists, skipping");
      return;
    }
    throw e;
  }
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("pbc_4318451124");
    return app.delete(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})
