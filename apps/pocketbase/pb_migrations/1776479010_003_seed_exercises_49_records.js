/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("exercises");

  const record0 = new Record(collection);
    record0.set("name", "Barbell Bench Press");
    record0.set("bodyPart", "Chest");
    record0.set("equipment", "Barbell");
    record0.set("difficulty", "Beginner");
    record0.set("mechanic", "Compound");
    record0.set("sets", 4);
    record0.set("reps", 8);
    record0.set("restSeconds", 180);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("name", "Dumbbell Curl");
    record1.set("bodyPart", "Biceps");
    record1.set("equipment", "Dumbbell");
    record1.set("difficulty", "Beginner");
    record1.set("mechanic", "Isolation");
    record1.set("sets", 3);
    record1.set("reps", 10);
    record1.set("restSeconds", 90);
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("name", "Barbell Squat");
    record2.set("bodyPart", "Quads");
    record2.set("equipment", "Barbell");
    record2.set("difficulty", "Beginner");
    record2.set("mechanic", "Compound");
    record2.set("sets", 4);
    record2.set("reps", 6);
    record2.set("restSeconds", 180);
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    record3.set("name", "Leg Press");
    record3.set("bodyPart", "Quads");
    record3.set("equipment", "Machine");
    record3.set("difficulty", "Beginner");
    record3.set("mechanic", "Compound");
    record3.set("sets", 3);
    record3.set("reps", 10);
    record3.set("restSeconds", 120);
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    record4.set("name", "Pull-up");
    record4.set("bodyPart", "Back");
    record4.set("equipment", "Bodyweight");
    record4.set("difficulty", "Intermediate");
    record4.set("mechanic", "Compound");
    record4.set("sets", 4);
    record4.set("reps", 8);
    record4.set("restSeconds", 120);
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record5 = new Record(collection);
    record5.set("name", "Dumbbell Row");
    record5.set("bodyPart", "Back");
    record5.set("equipment", "Dumbbell");
    record5.set("difficulty", "Beginner");
    record5.set("mechanic", "Compound");
    record5.set("sets", 4);
    record5.set("reps", 10);
    record5.set("restSeconds", 90);
  try {
    app.save(record5);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record6 = new Record(collection);
    record6.set("name", "Lateral Raise");
    record6.set("bodyPart", "Shoulders");
    record6.set("equipment", "Dumbbell");
    record6.set("difficulty", "Beginner");
    record6.set("mechanic", "Isolation");
    record6.set("sets", 3);
    record6.set("reps", 12);
    record6.set("restSeconds", 60);
  try {
    app.save(record6);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record7 = new Record(collection);
    record7.set("name", "Leg Curl");
    record7.set("bodyPart", "Hamstrings");
    record7.set("equipment", "Machine");
    record7.set("difficulty", "Beginner");
    record7.set("mechanic", "Isolation");
    record7.set("sets", 3);
    record7.set("reps", 12);
    record7.set("restSeconds", 60);
  try {
    app.save(record7);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record8 = new Record(collection);
    record8.set("name", "Calf Raise");
    record8.set("bodyPart", "Calves");
    record8.set("equipment", "Machine");
    record8.set("difficulty", "Beginner");
    record8.set("mechanic", "Isolation");
    record8.set("sets", 3);
    record8.set("reps", 15);
    record8.set("restSeconds", 60);
  try {
    app.save(record8);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record9 = new Record(collection);
    record9.set("name", "Plank");
    record9.set("bodyPart", "Core");
    record9.set("equipment", "Bodyweight");
    record9.set("difficulty", "Beginner");
    record9.set("mechanic", "Isolation");
    record9.set("sets", 3);
    record9.set("reps", 60);
    record9.set("restSeconds", 60);
  try {
    app.save(record9);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record10 = new Record(collection);
    record10.set("name", "Tricep Dip");
    record10.set("bodyPart", "Triceps");
    record10.set("equipment", "Bodyweight");
    record10.set("difficulty", "Intermediate");
    record10.set("mechanic", "Compound");
    record10.set("sets", 3);
    record10.set("reps", 8);
    record10.set("restSeconds", 90);
  try {
    app.save(record10);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record11 = new Record(collection);
    record11.set("name", "Barbell Deadlift");
    record11.set("bodyPart", "Back");
    record11.set("equipment", "Barbell");
    record11.set("difficulty", "Intermediate");
    record11.set("mechanic", "Compound");
    record11.set("sets", 3);
    record11.set("reps", 5);
    record11.set("restSeconds", 180);
  try {
    app.save(record11);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record12 = new Record(collection);
    record12.set("name", "Incline Dumbbell Press");
    record12.set("bodyPart", "Chest");
    record12.set("equipment", "Dumbbell");
    record12.set("difficulty", "Intermediate");
    record12.set("mechanic", "Compound");
    record12.set("sets", 4);
    record12.set("reps", 8);
    record12.set("restSeconds", 120);
  try {
    app.save(record12);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record13 = new Record(collection);
    record13.set("name", "Cable Fly");
    record13.set("bodyPart", "Chest");
    record13.set("equipment", "Cable");
    record13.set("difficulty", "Intermediate");
    record13.set("mechanic", "Isolation");
    record13.set("sets", 3);
    record13.set("reps", 12);
    record13.set("restSeconds", 60);
  try {
    app.save(record13);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record14 = new Record(collection);
    record14.set("name", "Barbell Row");
    record14.set("bodyPart", "Back");
    record14.set("equipment", "Barbell");
    record14.set("difficulty", "Intermediate");
    record14.set("mechanic", "Compound");
    record14.set("sets", 4);
    record14.set("reps", 6);
    record14.set("restSeconds", 120);
  try {
    app.save(record14);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record15 = new Record(collection);
    record15.set("name", "Lat Pulldown");
    record15.set("bodyPart", "Back");
    record15.set("equipment", "Cable");
    record15.set("difficulty", "Beginner");
    record15.set("mechanic", "Isolation");
    record15.set("sets", 3);
    record15.set("reps", 10);
    record15.set("restSeconds", 60);
  try {
    app.save(record15);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record16 = new Record(collection);
    record16.set("name", "Leg Extension");
    record16.set("bodyPart", "Quads");
    record16.set("equipment", "Machine");
    record16.set("difficulty", "Beginner");
    record16.set("mechanic", "Isolation");
    record16.set("sets", 3);
    record16.set("reps", 12);
    record16.set("restSeconds", 60);
  try {
    app.save(record16);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record17 = new Record(collection);
    record17.set("name", "Hack Squat");
    record17.set("bodyPart", "Quads");
    record17.set("equipment", "Machine");
    record17.set("difficulty", "Intermediate");
    record17.set("mechanic", "Compound");
    record17.set("sets", 3);
    record17.set("reps", 10);
    record17.set("restSeconds", 90);
  try {
    app.save(record17);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record18 = new Record(collection);
    record18.set("name", "Smith Machine Squat");
    record18.set("bodyPart", "Quads");
    record18.set("equipment", "Machine");
    record18.set("difficulty", "Beginner");
    record18.set("mechanic", "Compound");
    record18.set("sets", 4);
    record18.set("reps", 8);
    record18.set("restSeconds", 120);
  try {
    app.save(record18);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record19 = new Record(collection);
    record19.set("name", "Dumbbell Lunge");
    record19.set("bodyPart", "Quads");
    record19.set("equipment", "Dumbbell");
    record19.set("difficulty", "Beginner");
    record19.set("mechanic", "Compound");
    record19.set("sets", 3);
    record19.set("reps", 10);
    record19.set("restSeconds", 60);
  try {
    app.save(record19);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record20 = new Record(collection);
    record20.set("name", "Bulgarian Split Squat");
    record20.set("bodyPart", "Quads");
    record20.set("equipment", "Bodyweight");
    record20.set("difficulty", "Intermediate");
    record20.set("mechanic", "Compound");
    record20.set("sets", 3);
    record20.set("reps", 8);
    record20.set("restSeconds", 90);
  try {
    app.save(record20);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record21 = new Record(collection);
    record21.set("name", "Leg Press Machine");
    record21.set("bodyPart", "Quads");
    record21.set("equipment", "Machine");
    record21.set("difficulty", "Beginner");
    record21.set("mechanic", "Compound");
    record21.set("sets", 3);
    record21.set("reps", 12);
    record21.set("restSeconds", 120);
  try {
    app.save(record21);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record22 = new Record(collection);
    record22.set("name", "Hamstring Curl");
    record22.set("bodyPart", "Hamstrings");
    record22.set("equipment", "Machine");
    record22.set("difficulty", "Beginner");
    record22.set("mechanic", "Isolation");
    record22.set("sets", 3);
    record22.set("reps", 12);
    record22.set("restSeconds", 60);
  try {
    app.save(record22);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record23 = new Record(collection);
    record23.set("name", "Lying Leg Curl");
    record23.set("bodyPart", "Hamstrings");
    record23.set("equipment", "Machine");
    record23.set("difficulty", "Beginner");
    record23.set("mechanic", "Isolation");
    record23.set("sets", 3);
    record23.set("reps", 12);
    record23.set("restSeconds", 60);
  try {
    app.save(record23);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record24 = new Record(collection);
    record24.set("name", "Romanian Deadlift");
    record24.set("bodyPart", "Hamstrings");
    record24.set("equipment", "Barbell");
    record24.set("difficulty", "Intermediate");
    record24.set("mechanic", "Compound");
    record24.set("sets", 3);
    record24.set("reps", 8);
    record24.set("restSeconds", 120);
  try {
    app.save(record24);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record25 = new Record(collection);
    record25.set("name", "Seated Leg Curl");
    record25.set("bodyPart", "Hamstrings");
    record25.set("equipment", "Machine");
    record25.set("difficulty", "Beginner");
    record25.set("mechanic", "Isolation");
    record25.set("sets", 3);
    record25.set("reps", 12);
    record25.set("restSeconds", 60);
  try {
    app.save(record25);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record26 = new Record(collection);
    record26.set("name", "Standing Calf Raise");
    record26.set("bodyPart", "Calves");
    record26.set("equipment", "Machine");
    record26.set("difficulty", "Beginner");
    record26.set("mechanic", "Isolation");
    record26.set("sets", 3);
    record26.set("reps", 15);
    record26.set("restSeconds", 60);
  try {
    app.save(record26);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record27 = new Record(collection);
    record27.set("name", "Seated Calf Raise");
    record27.set("bodyPart", "Calves");
    record27.set("equipment", "Machine");
    record27.set("difficulty", "Beginner");
    record27.set("mechanic", "Isolation");
    record27.set("sets", 3);
    record27.set("reps", 15);
    record27.set("restSeconds", 60);
  try {
    app.save(record27);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record28 = new Record(collection);
    record28.set("name", "Dumbbell Calf Raise");
    record28.set("bodyPart", "Calves");
    record28.set("equipment", "Dumbbell");
    record28.set("difficulty", "Beginner");
    record28.set("mechanic", "Isolation");
    record28.set("sets", 3);
    record28.set("reps", 15);
    record28.set("restSeconds", 60);
  try {
    app.save(record28);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record29 = new Record(collection);
    record29.set("name", "Cable Calf Raise");
    record29.set("bodyPart", "Calves");
    record29.set("equipment", "Cable");
    record29.set("difficulty", "Beginner");
    record29.set("mechanic", "Isolation");
    record29.set("sets", 3);
    record29.set("reps", 15);
    record29.set("restSeconds", 60);
  try {
    app.save(record29);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record30 = new Record(collection);
    record30.set("name", "Barbell Shoulder Press");
    record30.set("bodyPart", "Shoulders");
    record30.set("equipment", "Barbell");
    record30.set("difficulty", "Intermediate");
    record30.set("mechanic", "Compound");
    record30.set("sets", 4);
    record30.set("reps", 6);
    record30.set("restSeconds", 120);
  try {
    app.save(record30);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record31 = new Record(collection);
    record31.set("name", "Dumbbell Shoulder Press");
    record31.set("bodyPart", "Shoulders");
    record31.set("equipment", "Dumbbell");
    record31.set("difficulty", "Intermediate");
    record31.set("mechanic", "Compound");
    record31.set("sets", 4);
    record31.set("reps", 8);
    record31.set("restSeconds", 90);
  try {
    app.save(record31);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record32 = new Record(collection);
    record32.set("name", "Machine Shoulder Press");
    record32.set("bodyPart", "Shoulders");
    record32.set("equipment", "Machine");
    record32.set("difficulty", "Beginner");
    record32.set("mechanic", "Compound");
    record32.set("sets", 3);
    record32.set("reps", 10);
    record32.set("restSeconds", 90);
  try {
    app.save(record32);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record33 = new Record(collection);
    record33.set("name", "Reverse Pec Deck");
    record33.set("bodyPart", "Shoulders");
    record33.set("equipment", "Machine");
    record33.set("difficulty", "Beginner");
    record33.set("mechanic", "Isolation");
    record33.set("sets", 3);
    record33.set("reps", 12);
    record33.set("restSeconds", 60);
  try {
    app.save(record33);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record34 = new Record(collection);
    record34.set("name", "Cable Lateral Raise");
    record34.set("bodyPart", "Shoulders");
    record34.set("equipment", "Cable");
    record34.set("difficulty", "Beginner");
    record34.set("mechanic", "Isolation");
    record34.set("sets", 3);
    record34.set("reps", 12);
    record34.set("restSeconds", 60);
  try {
    app.save(record34);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record35 = new Record(collection);
    record35.set("name", "Barbell Curl");
    record35.set("bodyPart", "Biceps");
    record35.set("equipment", "Barbell");
    record35.set("difficulty", "Beginner");
    record35.set("mechanic", "Isolation");
    record35.set("sets", 3);
    record35.set("reps", 8);
    record35.set("restSeconds", 90);
  try {
    app.save(record35);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record36 = new Record(collection);
    record36.set("name", "Dumbbell Hammer Curl");
    record36.set("bodyPart", "Biceps");
    record36.set("equipment", "Dumbbell");
    record36.set("difficulty", "Beginner");
    record36.set("mechanic", "Isolation");
    record36.set("sets", 3);
    record36.set("reps", 10);
    record36.set("restSeconds", 60);
  try {
    app.save(record36);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record37 = new Record(collection);
    record37.set("name", "Cable Curl");
    record37.set("bodyPart", "Biceps");
    record37.set("equipment", "Cable");
    record37.set("difficulty", "Beginner");
    record37.set("mechanic", "Isolation");
    record37.set("sets", 3);
    record37.set("reps", 12);
    record37.set("restSeconds", 60);
  try {
    app.save(record37);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record38 = new Record(collection);
    record38.set("name", "Machine Curl");
    record38.set("bodyPart", "Biceps");
    record38.set("equipment", "Machine");
    record38.set("difficulty", "Beginner");
    record38.set("mechanic", "Isolation");
    record38.set("sets", 3);
    record38.set("reps", 12);
    record38.set("restSeconds", 60);
  try {
    app.save(record38);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record39 = new Record(collection);
    record39.set("name", "Barbell Tricep Extension");
    record39.set("bodyPart", "Triceps");
    record39.set("equipment", "Barbell");
    record39.set("difficulty", "Intermediate");
    record39.set("mechanic", "Isolation");
    record39.set("sets", 3);
    record39.set("reps", 8);
    record39.set("restSeconds", 90);
  try {
    app.save(record39);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record40 = new Record(collection);
    record40.set("name", "Dumbbell Tricep Extension");
    record40.set("bodyPart", "Triceps");
    record40.set("equipment", "Dumbbell");
    record40.set("difficulty", "Beginner");
    record40.set("mechanic", "Isolation");
    record40.set("sets", 3);
    record40.set("reps", 10);
    record40.set("restSeconds", 60);
  try {
    app.save(record40);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record41 = new Record(collection);
    record41.set("name", "Rope Tricep Pushdown");
    record41.set("bodyPart", "Triceps");
    record41.set("equipment", "Cable");
    record41.set("difficulty", "Beginner");
    record41.set("mechanic", "Isolation");
    record41.set("sets", 3);
    record41.set("reps", 12);
    record41.set("restSeconds", 60);
  try {
    app.save(record41);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record42 = new Record(collection);
    record42.set("name", "Machine Tricep Extension");
    record42.set("bodyPart", "Triceps");
    record42.set("equipment", "Machine");
    record42.set("difficulty", "Beginner");
    record42.set("mechanic", "Isolation");
    record42.set("sets", 3);
    record42.set("reps", 12);
    record42.set("restSeconds", 60);
  try {
    app.save(record42);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record43 = new Record(collection);
    record43.set("name", "Tricep Kickback");
    record43.set("bodyPart", "Triceps");
    record43.set("equipment", "Dumbbell");
    record43.set("difficulty", "Beginner");
    record43.set("mechanic", "Isolation");
    record43.set("sets", 3);
    record43.set("reps", 12);
    record43.set("restSeconds", 60);
  try {
    app.save(record43);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record44 = new Record(collection);
    record44.set("name", "Decline Sit-up");
    record44.set("bodyPart", "Core");
    record44.set("equipment", "Bodyweight");
    record44.set("difficulty", "Intermediate");
    record44.set("mechanic", "Isolation");
    record44.set("sets", 3);
    record44.set("reps", 15);
    record44.set("restSeconds", 60);
  try {
    app.save(record44);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record45 = new Record(collection);
    record45.set("name", "Russian Twist");
    record45.set("bodyPart", "Core");
    record45.set("equipment", "Bodyweight");
    record45.set("difficulty", "Beginner");
    record45.set("mechanic", "Isolation");
    record45.set("sets", 3);
    record45.set("reps", 20);
    record45.set("restSeconds", 60);
  try {
    app.save(record45);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record46 = new Record(collection);
    record46.set("name", "Bicycle Crunch");
    record46.set("bodyPart", "Core");
    record46.set("equipment", "Bodyweight");
    record46.set("difficulty", "Beginner");
    record46.set("mechanic", "Isolation");
    record46.set("sets", 3);
    record46.set("reps", 20);
    record46.set("restSeconds", 60);
  try {
    app.save(record46);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record47 = new Record(collection);
    record47.set("name", "Ab Wheel Rollout");
    record47.set("bodyPart", "Core");
    record47.set("equipment", "Bodyweight");
    record47.set("difficulty", "Advanced");
    record47.set("mechanic", "Isolation");
    record47.set("sets", 3);
    record47.set("reps", 10);
    record47.set("restSeconds", 90);
  try {
    app.save(record47);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record48 = new Record(collection);
    record48.set("name", "Dead Bug");
    record48.set("bodyPart", "Core");
    record48.set("equipment", "Bodyweight");
    record48.set("difficulty", "Beginner");
    record48.set("mechanic", "Isolation");
    record48.set("sets", 3);
    record48.set("reps", 12);
    record48.set("restSeconds", 60);
  try {
    app.save(record48);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})
