/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("exercises");

  const record0 = new Record(collection);
    record0.set("name", "Barbell Bench Press");
    record0.set("equipment", "Barbell");
    record0.set("muscleGroup", "Chest");
    record0.set("description", "Classic compound chest exercise");
    record0.set("formTips", "Keep feet flat, lower to mid-chest, press explosively");
    record0.set("recommendedSetsReps", "3-4 sets x 6-8 reps");
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
    record1.set("name", "Dumbbell Bench Press");
    record1.set("equipment", "Dumbbell");
    record1.set("muscleGroup", "Chest");
    record1.set("description", "Unilateral chest press variation");
    record1.set("formTips", "Full range of motion, control the descent");
    record1.set("recommendedSetsReps", "3-4 sets x 8-10 reps");
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
    record2.set("name", "Incline Barbell Bench Press");
    record2.set("equipment", "Barbell");
    record2.set("muscleGroup", "Chest");
    record2.set("description", "Upper chest emphasis");
    record2.set("formTips", "30-45 degree incline, focus on upper chest");
    record2.set("recommendedSetsReps", "3 sets x 6-8 reps");
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
    record3.set("name", "Incline Dumbbell Bench Press");
    record3.set("equipment", "Dumbbell");
    record3.set("muscleGroup", "Chest");
    record3.set("description", "Upper chest with dumbbells");
    record3.set("formTips", "Controlled movement, full stretch at bottom");
    record3.set("recommendedSetsReps", "3 sets x 8-10 reps");
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
    record4.set("name", "Decline Barbell Bench Press");
    record4.set("equipment", "Barbell");
    record4.set("muscleGroup", "Chest");
    record4.set("description", "Lower chest emphasis");
    record4.set("formTips", "Decline bench, lower to lower chest");
    record4.set("recommendedSetsReps", "3 sets x 6-8 reps");
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
    record5.set("name", "Decline Dumbbell Bench Press");
    record5.set("equipment", "Dumbbell");
    record5.set("muscleGroup", "Chest");
    record5.set("description", "Lower chest with dumbbells");
    record5.set("formTips", "Controlled descent, full range");
    record5.set("recommendedSetsReps", "3 sets x 8-10 reps");
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
    record6.set("name", "Cable Chest Fly");
    record6.set("equipment", "Cable");
    record6.set("muscleGroup", "Chest");
    record6.set("description", "Isolation chest exercise");
    record6.set("formTips", "Slight bend in elbows, squeeze at peak");
    record6.set("recommendedSetsReps", "3 sets x 10-12 reps");
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
    record7.set("name", "Machine Chest Press");
    record7.set("equipment", "Machine");
    record7.set("muscleGroup", "Chest");
    record7.set("description", "Controlled chest press machine");
    record7.set("formTips", "Full range of motion, controlled tempo");
    record7.set("recommendedSetsReps", "3 sets x 10-12 reps");
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
    record8.set("name", "Push-ups");
    record8.set("equipment", "Bodyweight");
    record8.set("muscleGroup", "Chest");
    record8.set("description", "Classic bodyweight chest exercise");
    record8.set("formTips", "Straight body line, full range of motion");
    record8.set("recommendedSetsReps", "3 sets x 10-20 reps");
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
    record9.set("name", "Wide Grip Push-ups");
    record9.set("equipment", "Bodyweight");
    record9.set("muscleGroup", "Chest");
    record9.set("description", "Wider hand placement for chest emphasis");
    record9.set("formTips", "Hands wider than shoulders");
    record9.set("recommendedSetsReps", "3 sets x 8-15 reps");
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
    record10.set("name", "Diamond Push-ups");
    record10.set("equipment", "Bodyweight");
    record10.set("muscleGroup", "Chest");
    record10.set("description", "Triceps and chest variation");
    record10.set("formTips", "Hands form diamond shape");
    record10.set("recommendedSetsReps", "3 sets x 8-12 reps");
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
    record11.set("name", "Plyometric Push-ups");
    record11.set("equipment", "Bodyweight");
    record11.set("muscleGroup", "Chest");
    record11.set("description", "Explosive chest exercise");
    record11.set("formTips", "Explosive push, hands leave ground");
    record11.set("recommendedSetsReps", "3 sets x 5-10 reps");
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
    record12.set("name", "Dips");
    record12.set("equipment", "Pull-up Bar");
    record12.set("muscleGroup", "Chest");
    record12.set("description", "Compound chest and triceps exercise");
    record12.set("formTips", "Lean forward for chest, upright for triceps");
    record12.set("recommendedSetsReps", "3 sets x 6-12 reps");
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
    record13.set("name", "Weighted Dips");
    record13.set("equipment", "Pull-up Bar");
    record13.set("muscleGroup", "Chest");
    record13.set("description", "Dips with added weight");
    record13.set("formTips", "Controlled movement, full range");
    record13.set("recommendedSetsReps", "3 sets x 6-10 reps");
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
    record14.set("name", "Pec Deck Machine");
    record14.set("equipment", "Machine");
    record14.set("muscleGroup", "Chest");
    record14.set("description", "Isolation chest machine");
    record14.set("formTips", "Squeeze at peak contraction");
    record14.set("recommendedSetsReps", "3 sets x 10-12 reps");
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
    record15.set("name", "Barbell Rows");
    record15.set("equipment", "Barbell");
    record15.set("muscleGroup", "Back");
    record15.set("description", "Classic back compound exercise");
    record15.set("formTips", "Chest up, pull to lower chest");
    record15.set("recommendedSetsReps", "3-4 sets x 6-8 reps");
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
    record16.set("name", "Dumbbell Rows");
    record16.set("equipment", "Dumbbell");
    record16.set("muscleGroup", "Back");
    record16.set("description", "Unilateral back exercise");
    record16.set("formTips", "Retract scapula, full range of motion");
    record16.set("recommendedSetsReps", "3-4 sets x 8-10 reps");
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
    record17.set("name", "Seal Rows");
    record17.set("equipment", "Bench");
    record17.set("muscleGroup", "Back");
    record17.set("description", "Chest-supported row variation");
    record17.set("formTips", "Chest on incline, pull to chest");
    record17.set("recommendedSetsReps", "3 sets x 8-10 reps");
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
    record18.set("name", "T-Bar Rows");
    record18.set("equipment", "Barbell");
    record18.set("muscleGroup", "Back");
    record18.set("description", "Compound back exercise");
    record18.set("formTips", "Chest up, pull to chest");
    record18.set("recommendedSetsReps", "3 sets x 6-10 reps");
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
    record19.set("name", "Pendulum Rows");
    record19.set("equipment", "Machine");
    record19.set("muscleGroup", "Back");
    record19.set("description", "Machine-based row variation");
    record19.set("formTips", "Full range of motion, controlled tempo");
    record19.set("recommendedSetsReps", "3 sets x 8-10 reps");
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
    record20.set("name", "Pull-ups");
    record20.set("equipment", "Pull-up Bar");
    record20.set("muscleGroup", "Back");
    record20.set("description", "Classic back compound exercise");
    record20.set("formTips", "Full range of motion, chest to bar");
    record20.set("recommendedSetsReps", "3-4 sets x 5-12 reps");
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
    record21.set("name", "Weighted Pull-ups");
    record21.set("equipment", "Pull-up Bar");
    record21.set("muscleGroup", "Back");
    record21.set("description", "Pull-ups with added weight");
    record21.set("formTips", "Controlled movement, full range");
    record21.set("recommendedSetsReps", "3 sets x 5-8 reps");
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
    record22.set("name", "Chin-ups");
    record22.set("equipment", "Pull-up Bar");
    record22.set("muscleGroup", "Back");
    record22.set("description", "Underhand grip pull-ups");
    record22.set("formTips", "Hands shoulder-width, full range");
    record22.set("recommendedSetsReps", "3-4 sets x 6-12 reps");
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
    record23.set("name", "Assisted Pull-ups");
    record23.set("equipment", "Machine");
    record23.set("muscleGroup", "Back");
    record23.set("description", "Machine-assisted pull-ups");
    record23.set("formTips", "Full range of motion, reduce assistance over time");
    record23.set("recommendedSetsReps", "3 sets x 8-12 reps");
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
    record24.set("name", "Lat Pulldowns");
    record24.set("equipment", "Cable");
    record24.set("muscleGroup", "Back");
    record24.set("description", "Isolation back exercise");
    record24.set("formTips", "Pull to chest, retract scapula");
    record24.set("recommendedSetsReps", "3 sets x 8-12 reps");
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
    record25.set("name", "Wide Grip Lat Pulldowns");
    record25.set("equipment", "Cable");
    record25.set("muscleGroup", "Back");
    record25.set("description", "Wider grip lat pulldown");
    record25.set("formTips", "Wide grip, pull to upper chest");
    record25.set("recommendedSetsReps", "3 sets x 8-12 reps");
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
    record26.set("name", "Close Grip Lat Pulldowns");
    record26.set("equipment", "Cable");
    record26.set("muscleGroup", "Back");
    record26.set("description", "Narrow grip lat pulldown");
    record26.set("formTips", "Close grip, pull to lower chest");
    record26.set("recommendedSetsReps", "3 sets x 8-12 reps");
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
    record27.set("name", "Reverse Grip Lat Pulldowns");
    record27.set("equipment", "Cable");
    record27.set("muscleGroup", "Back");
    record27.set("description", "Underhand grip lat pulldown");
    record27.set("formTips", "Underhand grip, pull to chest");
    record27.set("recommendedSetsReps", "3 sets x 8-12 reps");
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
    record28.set("name", "Cable Rows");
    record28.set("equipment", "Cable");
    record28.set("muscleGroup", "Back");
    record28.set("description", "Cable machine row variation");
    record28.set("formTips", "Retract scapula, full range of motion");
    record28.set("recommendedSetsReps", "3 sets x 8-12 reps");
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
    record29.set("name", "Seated Cable Rows");
    record29.set("equipment", "Cable");
    record29.set("muscleGroup", "Back");
    record29.set("description", "Seated row on cable machine");
    record29.set("formTips", "Chest up, pull to chest");
    record29.set("recommendedSetsReps", "3 sets x 8-12 reps");
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
    record30.set("name", "Machine Rows");
    record30.set("equipment", "Machine");
    record30.set("muscleGroup", "Back");
    record30.set("description", "Machine-based row exercise");
    record30.set("formTips", "Full range of motion, controlled tempo");
    record30.set("recommendedSetsReps", "3 sets x 10-12 reps");
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
    record31.set("name", "Inverted Rows");
    record31.set("equipment", "Pull-up Bar");
    record31.set("muscleGroup", "Back");
    record31.set("description", "Bodyweight back exercise");
    record31.set("formTips", "Body straight, pull chest to bar");
    record31.set("recommendedSetsReps", "3 sets x 8-12 reps");
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
    record32.set("name", "Resistance Band Rows");
    record32.set("equipment", "Bands");
    record32.set("muscleGroup", "Back");
    record32.set("description", "Band-based row exercise");
    record32.set("formTips", "Retract scapula, full range of motion");
    record32.set("recommendedSetsReps", "3 sets x 10-15 reps");
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
    record33.set("name", "Barbell Shrugs");
    record33.set("equipment", "Barbell");
    record33.set("muscleGroup", "Shoulders");
    record33.set("description", "Trapezius isolation exercise");
    record33.set("formTips", "Shrug shoulders up, squeeze at top");
    record33.set("recommendedSetsReps", "3-4 sets x 8-12 reps");
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
    record34.set("name", "Dumbbell Shrugs");
    record34.set("equipment", "Dumbbell");
    record34.set("muscleGroup", "Shoulders");
    record34.set("description", "Dumbbell trapezius exercise");
    record34.set("formTips", "Shrug up, squeeze traps");
    record34.set("recommendedSetsReps", "3-4 sets x 8-12 reps");
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
    record35.set("name", "Machine Shrugs");
    record35.set("equipment", "Machine");
    record35.set("muscleGroup", "Shoulders");
    record35.set("description", "Machine-based shrug");
    record35.set("formTips", "Full range of motion, squeeze at top");
    record35.set("recommendedSetsReps", "3 sets x 10-12 reps");
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
    record36.set("name", "Barbell Overhead Press");
    record36.set("equipment", "Barbell");
    record36.set("muscleGroup", "Shoulders");
    record36.set("description", "Classic shoulder compound exercise");
    record36.set("formTips", "Chest up, press straight up");
    record36.set("recommendedSetsReps", "3-4 sets x 6-8 reps");
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
    record37.set("name", "Dumbbell Overhead Press");
    record37.set("equipment", "Dumbbell");
    record37.set("muscleGroup", "Shoulders");
    record37.set("description", "Unilateral shoulder press");
    record37.set("formTips", "Full range of motion, controlled descent");
    record37.set("recommendedSetsReps", "3-4 sets x 8-10 reps");
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
    record38.set("name", "Machine Shoulder Press");
    record38.set("equipment", "Machine");
    record38.set("muscleGroup", "Shoulders");
    record38.set("description", "Machine-based shoulder press");
    record38.set("formTips", "Full range of motion, controlled tempo");
    record38.set("recommendedSetsReps", "3 sets x 10-12 reps");
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
    record39.set("name", "Pike Push-ups");
    record39.set("equipment", "Bodyweight");
    record39.set("muscleGroup", "Shoulders");
    record39.set("description", "Bodyweight shoulder exercise");
    record39.set("formTips", "Hips high, push straight up");
    record39.set("recommendedSetsReps", "3 sets x 8-12 reps");
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
    record40.set("name", "Handstand Push-ups");
    record40.set("equipment", "Bodyweight");
    record40.set("muscleGroup", "Shoulders");
    record40.set("description", "Advanced shoulder exercise");
    record40.set("formTips", "Controlled movement, full range");
    record40.set("recommendedSetsReps", "3 sets x 5-10 reps");
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
    record41.set("name", "Lateral Raises");
    record41.set("equipment", "Dumbbell");
    record41.set("muscleGroup", "Shoulders");
    record41.set("description", "Lateral deltoid isolation");
    record41.set("formTips", "Slight bend in elbows, raise to shoulder height");
    record41.set("recommendedSetsReps", "3 sets x 10-15 reps");
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
    record42.set("name", "Cable Lateral Raises");
    record42.set("equipment", "Cable");
    record42.set("muscleGroup", "Shoulders");
    record42.set("description", "Cable-based lateral raise");
    record42.set("formTips", "Controlled movement, squeeze at top");
    record42.set("recommendedSetsReps", "3 sets x 10-15 reps");
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
    record43.set("name", "Machine Lateral Raises");
    record43.set("equipment", "Machine");
    record43.set("muscleGroup", "Shoulders");
    record43.set("description", "Machine-based lateral raise");
    record43.set("formTips", "Full range of motion, controlled tempo");
    record43.set("recommendedSetsReps", "3 sets x 10-15 reps");
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
    record44.set("name", "Front Raises");
    record44.set("equipment", "Dumbbell");
    record44.set("muscleGroup", "Shoulders");
    record44.set("description", "Front deltoid isolation");
    record44.set("formTips", "Slight bend in elbows, raise to shoulder height");
    record44.set("recommendedSetsReps", "3 sets x 10-15 reps");
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
    record45.set("name", "Barbell Front Raises");
    record45.set("equipment", "Barbell");
    record45.set("muscleGroup", "Shoulders");
    record45.set("description", "Barbell front raise");
    record45.set("formTips", "Controlled movement, raise to shoulder height");
    record45.set("recommendedSetsReps", "3 sets x 8-12 reps");
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
    record46.set("name", "Cable Front Raises");
    record46.set("equipment", "Cable");
    record46.set("muscleGroup", "Shoulders");
    record46.set("description", "Cable-based front raise");
    record46.set("formTips", "Controlled movement, squeeze at top");
    record46.set("recommendedSetsReps", "3 sets x 10-15 reps");
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
    record47.set("name", "Reverse Pec Deck");
    record47.set("equipment", "Machine");
    record47.set("muscleGroup", "Shoulders");
    record47.set("description", "Rear deltoid isolation machine");
    record47.set("formTips", "Squeeze at peak contraction");
    record47.set("recommendedSetsReps", "3 sets x 10-15 reps");
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
    record48.set("name", "Reverse Cable Flyes");
    record48.set("equipment", "Cable");
    record48.set("muscleGroup", "Shoulders");
    record48.set("description", "Rear deltoid cable exercise");
    record48.set("formTips", "Controlled movement, squeeze at peak");
    record48.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record48);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record49 = new Record(collection);
    record49.set("name", "Dumbbell Reverse Flyes");
    record49.set("equipment", "Dumbbell");
    record49.set("muscleGroup", "Shoulders");
    record49.set("description", "Rear deltoid dumbbell exercise");
    record49.set("formTips", "Slight bend in elbows, raise to shoulder height");
    record49.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record49);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record50 = new Record(collection);
    record50.set("name", "Upright Rows");
    record50.set("equipment", "Barbell");
    record50.set("muscleGroup", "Shoulders");
    record50.set("description", "Compound shoulder exercise");
    record50.set("formTips", "Elbows high, pull to chin");
    record50.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record50);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record51 = new Record(collection);
    record51.set("name", "Dumbbell Upright Rows");
    record51.set("equipment", "Dumbbell");
    record51.set("muscleGroup", "Shoulders");
    record51.set("description", "Dumbbell upright row");
    record51.set("formTips", "Elbows high, pull to shoulders");
    record51.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record51);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record52 = new Record(collection);
    record52.set("name", "Cable Upright Rows");
    record52.set("equipment", "Cable");
    record52.set("muscleGroup", "Shoulders");
    record52.set("description", "Cable upright row");
    record52.set("formTips", "Elbows high, pull to chest");
    record52.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record52);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record53 = new Record(collection);
    record53.set("name", "Barbell Squats");
    record53.set("equipment", "Barbell");
    record53.set("muscleGroup", "Legs");
    record53.set("description", "Classic leg compound exercise");
    record53.set("formTips", "Chest up, knees track toes, full depth");
    record53.set("recommendedSetsReps", "3-4 sets x 6-8 reps");
  try {
    app.save(record53);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record54 = new Record(collection);
    record54.set("name", "Goblet Squats");
    record54.set("equipment", "Dumbbell");
    record54.set("muscleGroup", "Legs");
    record54.set("description", "Dumbbell squat variation");
    record54.set("formTips", "Chest up, full depth, controlled descent");
    record54.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record54);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record55 = new Record(collection);
    record55.set("name", "Leg Press");
    record55.set("equipment", "Machine");
    record55.set("muscleGroup", "Legs");
    record55.set("description", "Machine-based leg press");
    record55.set("formTips", "Full range of motion, controlled tempo");
    record55.set("recommendedSetsReps", "3-4 sets x 8-12 reps");
  try {
    app.save(record55);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record56 = new Record(collection);
    record56.set("name", "Hack Squats");
    record56.set("equipment", "Machine");
    record56.set("muscleGroup", "Legs");
    record56.set("description", "Machine-based squat variation");
    record56.set("formTips", "Full range of motion, controlled descent");
    record56.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record56);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record57 = new Record(collection);
    record57.set("name", "Smith Machine Squats");
    record57.set("equipment", "Machine");
    record57.set("muscleGroup", "Legs");
    record57.set("description", "Smith machine squat");
    record57.set("formTips", "Full range of motion, controlled tempo");
    record57.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record57);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record58 = new Record(collection);
    record58.set("name", "Bulgarian Split Squats");
    record58.set("equipment", "Bench");
    record58.set("muscleGroup", "Legs");
    record58.set("description", "Single-leg squat variation");
    record58.set("formTips", "Back foot elevated, full depth");
    record58.set("recommendedSetsReps", "3 sets x 8-12 reps per leg");
  try {
    app.save(record58);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record59 = new Record(collection);
    record59.set("name", "Dumbbell Bulgarian Split Squats");
    record59.set("equipment", "Dumbbell");
    record59.set("muscleGroup", "Legs");
    record59.set("description", "Weighted split squat");
    record59.set("formTips", "Back foot elevated, controlled movement");
    record59.set("recommendedSetsReps", "3 sets x 8-12 reps per leg");
  try {
    app.save(record59);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record60 = new Record(collection);
    record60.set("name", "Lunges");
    record60.set("equipment", "Bodyweight");
    record60.set("muscleGroup", "Legs");
    record60.set("description", "Classic leg exercise");
    record60.set("formTips", "Front knee over ankle, back knee down");
    record60.set("recommendedSetsReps", "3 sets x 10-12 reps per leg");
  try {
    app.save(record60);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record61 = new Record(collection);
    record61.set("name", "Dumbbell Lunges");
    record61.set("equipment", "Dumbbell");
    record61.set("muscleGroup", "Legs");
    record61.set("description", "Weighted lunge variation");
    record61.set("formTips", "Controlled movement, full range of motion");
    record61.set("recommendedSetsReps", "3 sets x 8-12 reps per leg");
  try {
    app.save(record61);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record62 = new Record(collection);
    record62.set("name", "Barbell Lunges");
    record62.set("equipment", "Barbell");
    record62.set("muscleGroup", "Legs");
    record62.set("description", "Barbell lunge variation");
    record62.set("formTips", "Chest up, controlled descent");
    record62.set("recommendedSetsReps", "3 sets x 8-10 reps per leg");
  try {
    app.save(record62);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record63 = new Record(collection);
    record63.set("name", "Walking Lunges");
    record63.set("equipment", "Bodyweight");
    record63.set("muscleGroup", "Legs");
    record63.set("description", "Dynamic lunge variation");
    record63.set("formTips", "Controlled movement, full range of motion");
    record63.set("recommendedSetsReps", "3 sets x 10-15 reps per leg");
  try {
    app.save(record63);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record64 = new Record(collection);
    record64.set("name", "Reverse Lunges");
    record64.set("equipment", "Bodyweight");
    record64.set("muscleGroup", "Legs");
    record64.set("description", "Reverse lunge variation");
    record64.set("formTips", "Back knee down, front knee over ankle");
    record64.set("recommendedSetsReps", "3 sets x 10-12 reps per leg");
  try {
    app.save(record64);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record65 = new Record(collection);
    record65.set("name", "Leg Extensions");
    record65.set("equipment", "Machine");
    record65.set("muscleGroup", "Legs");
    record65.set("description", "Quadriceps isolation machine");
    record65.set("formTips", "Full range of motion, squeeze at top");
    record65.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record65);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record66 = new Record(collection);
    record66.set("name", "Leg Curls");
    record66.set("equipment", "Machine");
    record66.set("muscleGroup", "Legs");
    record66.set("description", "Hamstring isolation machine");
    record66.set("formTips", "Full range of motion, squeeze at top");
    record66.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record66);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record67 = new Record(collection);
    record67.set("name", "Lying Leg Curls");
    record67.set("equipment", "Machine");
    record67.set("muscleGroup", "Legs");
    record67.set("description", "Lying hamstring curl machine");
    record67.set("formTips", "Full range of motion, controlled tempo");
    record67.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record67);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record68 = new Record(collection);
    record68.set("name", "Seated Leg Curls");
    record68.set("equipment", "Machine");
    record68.set("muscleGroup", "Legs");
    record68.set("description", "Seated hamstring curl machine");
    record68.set("formTips", "Full range of motion, squeeze at top");
    record68.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record68);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record69 = new Record(collection);
    record69.set("name", "Standing Leg Curls");
    record69.set("equipment", "Machine");
    record69.set("muscleGroup", "Legs");
    record69.set("description", "Standing hamstring curl machine");
    record69.set("formTips", "Controlled movement, full range of motion");
    record69.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record69);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record70 = new Record(collection);
    record70.set("name", "Leg Press Calf Raises");
    record70.set("equipment", "Machine");
    record70.set("muscleGroup", "Legs");
    record70.set("description", "Calf raise on leg press");
    record70.set("formTips", "Full range of motion, squeeze at top");
    record70.set("recommendedSetsReps", "3 sets x 12-20 reps");
  try {
    app.save(record70);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record71 = new Record(collection);
    record71.set("name", "Standing Calf Raises");
    record71.set("equipment", "Machine");
    record71.set("muscleGroup", "Legs");
    record71.set("description", "Standing calf raise machine");
    record71.set("formTips", "Full range of motion, squeeze at top");
    record71.set("recommendedSetsReps", "3 sets x 12-20 reps");
  try {
    app.save(record71);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record72 = new Record(collection);
    record72.set("name", "Seated Calf Raises");
    record72.set("equipment", "Machine");
    record72.set("muscleGroup", "Legs");
    record72.set("description", "Seated calf raise machine");
    record72.set("formTips", "Full range of motion, squeeze at top");
    record72.set("recommendedSetsReps", "3 sets x 12-20 reps");
  try {
    app.save(record72);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record73 = new Record(collection);
    record73.set("name", "Dumbbell Calf Raises");
    record73.set("equipment", "Dumbbell");
    record73.set("muscleGroup", "Legs");
    record73.set("description", "Dumbbell calf raise");
    record73.set("formTips", "Full range of motion, squeeze at top");
    record73.set("recommendedSetsReps", "3 sets x 12-20 reps");
  try {
    app.save(record73);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record74 = new Record(collection);
    record74.set("name", "Barbell Calf Raises");
    record74.set("equipment", "Barbell");
    record74.set("muscleGroup", "Legs");
    record74.set("description", "Barbell calf raise");
    record74.set("formTips", "Full range of motion, controlled tempo");
    record74.set("recommendedSetsReps", "3 sets x 12-20 reps");
  try {
    app.save(record74);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record75 = new Record(collection);
    record75.set("name", "Deadlifts");
    record75.set("equipment", "Barbell");
    record75.set("muscleGroup", "Legs");
    record75.set("description", "Classic compound leg exercise");
    record75.set("formTips", "Chest up, neutral spine, drive through heels");
    record75.set("recommendedSetsReps", "3-4 sets x 3-6 reps");
  try {
    app.save(record75);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record76 = new Record(collection);
    record76.set("name", "Romanian Deadlifts");
    record76.set("equipment", "Barbell");
    record76.set("muscleGroup", "Legs");
    record76.set("description", "Hamstring-focused deadlift variation");
    record76.set("formTips", "Slight knee bend, hinge at hips");
    record76.set("recommendedSetsReps", "3 sets x 6-8 reps");
  try {
    app.save(record76);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record77 = new Record(collection);
    record77.set("name", "Dumbbell Deadlifts");
    record77.set("equipment", "Dumbbell");
    record77.set("muscleGroup", "Legs");
    record77.set("description", "Dumbbell deadlift variation");
    record77.set("formTips", "Chest up, full range of motion");
    record77.set("recommendedSetsReps", "3 sets x 8-10 reps");
  try {
    app.save(record77);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record78 = new Record(collection);
    record78.set("name", "Trap Bar Deadlifts");
    record78.set("equipment", "Barbell");
    record78.set("muscleGroup", "Legs");
    record78.set("description", "Trap bar deadlift variation");
    record78.set("formTips", "Neutral grip, chest up, drive through heels");
    record78.set("recommendedSetsReps", "3 sets x 6-8 reps");
  try {
    app.save(record78);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record79 = new Record(collection);
    record79.set("name", "Sumo Deadlifts");
    record79.set("equipment", "Barbell");
    record79.set("muscleGroup", "Legs");
    record79.set("description", "Wide stance deadlift variation");
    record79.set("formTips", "Wide stance, chest up, drive through heels");
    record79.set("recommendedSetsReps", "3 sets x 6-8 reps");
  try {
    app.save(record79);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record80 = new Record(collection);
    record80.set("name", "Leg Press Deadlifts");
    record80.set("equipment", "Machine");
    record80.set("muscleGroup", "Legs");
    record80.set("description", "Machine-based deadlift variation");
    record80.set("formTips", "Full range of motion, controlled tempo");
    record80.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record80);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record81 = new Record(collection);
    record81.set("name", "Barbell Curls");
    record81.set("equipment", "Barbell");
    record81.set("muscleGroup", "Arms");
    record81.set("description", "Classic bicep exercise");
    record81.set("formTips", "Elbows at sides, full range of motion");
    record81.set("recommendedSetsReps", "3-4 sets x 6-10 reps");
  try {
    app.save(record81);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record82 = new Record(collection);
    record82.set("name", "Dumbbell Curls");
    record82.set("equipment", "Dumbbell");
    record82.set("muscleGroup", "Arms");
    record82.set("description", "Unilateral bicep exercise");
    record82.set("formTips", "Controlled movement, full range of motion");
    record82.set("recommendedSetsReps", "3-4 sets x 8-12 reps");
  try {
    app.save(record82);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record83 = new Record(collection);
    record83.set("name", "Hammer Curls");
    record83.set("equipment", "Dumbbell");
    record83.set("muscleGroup", "Arms");
    record83.set("description", "Neutral grip bicep exercise");
    record83.set("formTips", "Neutral grip, full range of motion");
    record83.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record83);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record84 = new Record(collection);
    record84.set("name", "Cable Curls");
    record84.set("equipment", "Cable");
    record84.set("muscleGroup", "Arms");
    record84.set("description", "Cable-based bicep exercise");
    record84.set("formTips", "Constant tension, full range of motion");
    record84.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record84);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record85 = new Record(collection);
    record85.set("name", "Machine Curls");
    record85.set("equipment", "Machine");
    record85.set("muscleGroup", "Arms");
    record85.set("description", "Machine-based bicep exercise");
    record85.set("formTips", "Full range of motion, controlled tempo");
    record85.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record85);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record86 = new Record(collection);
    record86.set("name", "Preacher Curls");
    record86.set("equipment", "Bench");
    record86.set("muscleGroup", "Arms");
    record86.set("description", "Isolation bicep exercise");
    record86.set("formTips", "Full range of motion, squeeze at top");
    record86.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record86);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record87 = new Record(collection);
    record87.set("name", "Dumbbell Preacher Curls");
    record87.set("equipment", "Dumbbell");
    record87.set("muscleGroup", "Arms");
    record87.set("description", "Dumbbell preacher curl");
    record87.set("formTips", "Controlled movement, full range of motion");
    record87.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record87);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record88 = new Record(collection);
    record88.set("name", "Barbell Preacher Curls");
    record88.set("equipment", "Barbell");
    record88.set("muscleGroup", "Arms");
    record88.set("description", "Barbell preacher curl");
    record88.set("formTips", "Full range of motion, squeeze at top");
    record88.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record88);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record89 = new Record(collection);
    record89.set("name", "Concentration Curls");
    record89.set("equipment", "Dumbbell");
    record89.set("muscleGroup", "Arms");
    record89.set("description", "Isolation bicep exercise");
    record89.set("formTips", "Elbow on knee, full range of motion");
    record89.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record89);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record90 = new Record(collection);
    record90.set("name", "Resistance Band Curls");
    record90.set("equipment", "Bands");
    record90.set("muscleGroup", "Arms");
    record90.set("description", "Band-based bicep exercise");
    record90.set("formTips", "Constant tension, full range of motion");
    record90.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record90);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record91 = new Record(collection);
    record91.set("name", "Tricep Dips");
    record91.set("equipment", "Pull-up Bar");
    record91.set("muscleGroup", "Arms");
    record91.set("description", "Bodyweight tricep exercise");
    record91.set("formTips", "Upright position, full range of motion");
    record91.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record91);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record92 = new Record(collection);
    record92.set("name", "Weighted Tricep Dips");
    record92.set("equipment", "Pull-up Bar");
    record92.set("muscleGroup", "Arms");
    record92.set("description", "Weighted tricep dips");
    record92.set("formTips", "Controlled movement, full range of motion");
    record92.set("recommendedSetsReps", "3 sets x 6-10 reps");
  try {
    app.save(record92);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record93 = new Record(collection);
    record93.set("name", "Tricep Pushdowns");
    record93.set("equipment", "Cable");
    record93.set("muscleGroup", "Arms");
    record93.set("description", "Cable tricep exercise");
    record93.set("formTips", "Elbows at sides, full range of motion");
    record93.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record93);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record94 = new Record(collection);
    record94.set("name", "Rope Tricep Pushdowns");
    record94.set("equipment", "Cable");
    record94.set("muscleGroup", "Arms");
    record94.set("description", "Rope attachment tricep pushdown");
    record94.set("formTips", "Elbows at sides, split rope at bottom");
    record94.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record94);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record95 = new Record(collection);
    record95.set("name", "V-Bar Tricep Pushdowns");
    record95.set("equipment", "Cable");
    record95.set("muscleGroup", "Arms");
    record95.set("description", "V-bar attachment tricep pushdown");
    record95.set("formTips", "Elbows at sides, full range of motion");
    record95.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record95);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record96 = new Record(collection);
    record96.set("name", "Overhead Tricep Extensions");
    record96.set("equipment", "Dumbbell");
    record96.set("muscleGroup", "Arms");
    record96.set("description", "Overhead tricep exercise");
    record96.set("formTips", "Full range of motion, controlled descent");
    record96.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record96);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record97 = new Record(collection);
    record97.set("name", "Barbell Overhead Tricep Extensions");
    record97.set("equipment", "Barbell");
    record97.set("muscleGroup", "Arms");
    record97.set("description", "Barbell overhead tricep extension");
    record97.set("formTips", "Full range of motion, controlled tempo");
    record97.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record97);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record98 = new Record(collection);
    record98.set("name", "Cable Overhead Tricep Extensions");
    record98.set("equipment", "Cable");
    record98.set("muscleGroup", "Arms");
    record98.set("description", "Cable overhead tricep extension");
    record98.set("formTips", "Full range of motion, squeeze at top");
    record98.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record98);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record99 = new Record(collection);
    record99.set("name", "Tricep Kickbacks");
    record99.set("equipment", "Dumbbell");
    record99.set("muscleGroup", "Arms");
    record99.set("description", "Isolation tricep exercise");
    record99.set("formTips", "Elbow at side, full range of motion");
    record99.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record99);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record100 = new Record(collection);
    record100.set("name", "Machine Tricep Extensions");
    record100.set("equipment", "Machine");
    record100.set("muscleGroup", "Arms");
    record100.set("description", "Machine-based tricep exercise");
    record100.set("formTips", "Full range of motion, controlled tempo");
    record100.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record100);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record101 = new Record(collection);
    record101.set("name", "Resistance Band Tricep Extensions");
    record101.set("equipment", "Bands");
    record101.set("muscleGroup", "Arms");
    record101.set("description", "Band-based tricep exercise");
    record101.set("formTips", "Full range of motion, constant tension");
    record101.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record101);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record102 = new Record(collection);
    record102.set("name", "Close Grip Bench Press");
    record102.set("equipment", "Barbell");
    record102.set("muscleGroup", "Arms");
    record102.set("description", "Tricep-focused bench press");
    record102.set("formTips", "Hands close together, full range of motion");
    record102.set("recommendedSetsReps", "3 sets x 6-10 reps");
  try {
    app.save(record102);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record103 = new Record(collection);
    record103.set("name", "Close Grip Dumbbell Bench Press");
    record103.set("equipment", "Dumbbell");
    record103.set("muscleGroup", "Arms");
    record103.set("description", "Close grip dumbbell bench press");
    record103.set("formTips", "Hands close, controlled descent");
    record103.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record103);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record104 = new Record(collection);
    record104.set("name", "Skull Crushers");
    record104.set("equipment", "Barbell");
    record104.set("muscleGroup", "Arms");
    record104.set("description", "Tricep isolation exercise");
    record104.set("formTips", "Lower to forehead, full range of motion");
    record104.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record104);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record105 = new Record(collection);
    record105.set("name", "Dumbbell Skull Crushers");
    record105.set("equipment", "Dumbbell");
    record105.set("muscleGroup", "Arms");
    record105.set("description", "Dumbbell skull crusher");
    record105.set("formTips", "Lower to forehead, controlled movement");
    record105.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record105);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record106 = new Record(collection);
    record106.set("name", "Cable Skull Crushers");
    record106.set("equipment", "Cable");
    record106.set("muscleGroup", "Arms");
    record106.set("description", "Cable skull crusher");
    record106.set("formTips", "Lower to forehead, full range of motion");
    record106.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record106);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record107 = new Record(collection);
    record107.set("name", "Crunches");
    record107.set("equipment", "Bodyweight");
    record107.set("muscleGroup", "Abs-Core");
    record107.set("description", "Classic abdominal exercise");
    record107.set("formTips", "Controlled movement, squeeze at top");
    record107.set("recommendedSetsReps", "3 sets x 15-20 reps");
  try {
    app.save(record107);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record108 = new Record(collection);
    record108.set("name", "Machine Crunches");
    record108.set("equipment", "Machine");
    record108.set("muscleGroup", "Abs-Core");
    record108.set("description", "Machine-based crunch");
    record108.set("formTips", "Full range of motion, squeeze at top");
    record108.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record108);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record109 = new Record(collection);
    record109.set("name", "Cable Crunches");
    record109.set("equipment", "Cable");
    record109.set("muscleGroup", "Abs-Core");
    record109.set("description", "Cable-based crunch");
    record109.set("formTips", "Controlled movement, squeeze at top");
    record109.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record109);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record110 = new Record(collection);
    record110.set("name", "Decline Sit-ups");
    record110.set("equipment", "Bench");
    record110.set("muscleGroup", "Abs-Core");
    record110.set("description", "Decline bench sit-up");
    record110.set("formTips", "Full range of motion, controlled descent");
    record110.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record110);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record111 = new Record(collection);
    record111.set("name", "Weighted Sit-ups");
    record111.set("equipment", "Dumbbell");
    record111.set("muscleGroup", "Abs-Core");
    record111.set("description", "Weighted sit-up variation");
    record111.set("formTips", "Full range of motion, controlled movement");
    record111.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record111);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record112 = new Record(collection);
    record112.set("name", "Sit-ups");
    record112.set("equipment", "Bodyweight");
    record112.set("muscleGroup", "Abs-Core");
    record112.set("description", "Classic abdominal exercise");
    record112.set("formTips", "Full range of motion, controlled descent");
    record112.set("recommendedSetsReps", "3 sets x 10-20 reps");
  try {
    app.save(record112);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record113 = new Record(collection);
    record113.set("name", "Leg Raises");
    record113.set("equipment", "Bodyweight");
    record113.set("muscleGroup", "Abs-Core");
    record113.set("description", "Lower abdominal exercise");
    record113.set("formTips", "Controlled movement, full range of motion");
    record113.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record113);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record114 = new Record(collection);
    record114.set("name", "Hanging Leg Raises");
    record114.set("equipment", "Pull-up Bar");
    record114.set("muscleGroup", "Abs-Core");
    record114.set("description", "Hanging lower ab exercise");
    record114.set("formTips", "Controlled movement, full range of motion");
    record114.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record114);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record115 = new Record(collection);
    record115.set("name", "Machine Leg Raises");
    record115.set("equipment", "Machine");
    record115.set("muscleGroup", "Abs-Core");
    record115.set("description", "Machine-based leg raise");
    record115.set("formTips", "Full range of motion, controlled tempo");
    record115.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record115);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record116 = new Record(collection);
    record116.set("name", "Cable Leg Raises");
    record116.set("equipment", "Cable");
    record116.set("muscleGroup", "Abs-Core");
    record116.set("description", "Cable-based leg raise");
    record116.set("formTips", "Controlled movement, full range of motion");
    record116.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record116);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record117 = new Record(collection);
    record117.set("name", "Planks");
    record117.set("equipment", "Bodyweight");
    record117.set("muscleGroup", "Abs-Core");
    record117.set("description", "Isometric core exercise");
    record117.set("formTips", "Straight body line, engage core");
    record117.set("recommendedSetsReps", "3 sets x 30-60 seconds");
  try {
    app.save(record117);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record118 = new Record(collection);
    record118.set("name", "Side Planks");
    record118.set("equipment", "Bodyweight");
    record118.set("muscleGroup", "Abs-Core");
    record118.set("description", "Lateral core exercise");
    record118.set("formTips", "Straight body line, engage obliques");
    record118.set("recommendedSetsReps", "3 sets x 20-40 seconds per side");
  try {
    app.save(record118);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record119 = new Record(collection);
    record119.set("name", "Weighted Planks");
    record119.set("equipment", "Dumbbell");
    record119.set("muscleGroup", "Abs-Core");
    record119.set("description", "Weighted plank variation");
    record119.set("formTips", "Straight body line, engage core");
    record119.set("recommendedSetsReps", "3 sets x 30-45 seconds");
  try {
    app.save(record119);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record120 = new Record(collection);
    record120.set("name", "Plank Variations");
    record120.set("equipment", "Bodyweight");
    record120.set("muscleGroup", "Abs-Core");
    record120.set("description", "Various plank modifications");
    record120.set("formTips", "Maintain straight body line");
    record120.set("recommendedSetsReps", "3 sets x 30-60 seconds");
  try {
    app.save(record120);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record121 = new Record(collection);
    record121.set("name", "Russian Twists");
    record121.set("equipment", "Dumbbell");
    record121.set("muscleGroup", "Abs-Core");
    record121.set("description", "Oblique rotation exercise");
    record121.set("formTips", "Controlled rotation, full range of motion");
    record121.set("recommendedSetsReps", "3 sets x 15-20 reps per side");
  try {
    app.save(record121);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record122 = new Record(collection);
    record122.set("name", "Weighted Russian Twists");
    record122.set("equipment", "Dumbbell");
    record122.set("muscleGroup", "Abs-Core");
    record122.set("description", "Weighted Russian twist");
    record122.set("formTips", "Controlled rotation, engage obliques");
    record122.set("recommendedSetsReps", "3 sets x 12-15 reps per side");
  try {
    app.save(record122);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record123 = new Record(collection);
    record123.set("name", "Cable Woodchops");
    record123.set("equipment", "Cable");
    record123.set("muscleGroup", "Abs-Core");
    record123.set("description", "Rotational core exercise");
    record123.set("formTips", "Controlled rotation, full range of motion");
    record123.set("recommendedSetsReps", "3 sets x 10-12 reps per side");
  try {
    app.save(record123);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record124 = new Record(collection);
    record124.set("name", "Dumbbell Woodchops");
    record124.set("equipment", "Dumbbell");
    record124.set("muscleGroup", "Abs-Core");
    record124.set("description", "Dumbbell rotational exercise");
    record124.set("formTips", "Controlled rotation, full range of motion");
    record124.set("recommendedSetsReps", "3 sets x 10-12 reps per side");
  try {
    app.save(record124);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record125 = new Record(collection);
    record125.set("name", "Ab Wheel Rollouts");
    record125.set("equipment", "Bodyweight");
    record125.set("muscleGroup", "Abs-Core");
    record125.set("description", "Advanced core exercise");
    record125.set("formTips", "Controlled movement, full range of motion");
    record125.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record125);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record126 = new Record(collection);
    record126.set("name", "Machine Ab Wheel");
    record126.set("equipment", "Machine");
    record126.set("muscleGroup", "Abs-Core");
    record126.set("description", "Machine-based ab wheel");
    record126.set("formTips", "Full range of motion, controlled tempo");
    record126.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record126);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record127 = new Record(collection);
    record127.set("name", "Resistance Band Woodchops");
    record127.set("equipment", "Bands");
    record127.set("muscleGroup", "Abs-Core");
    record127.set("description", "Band-based rotational exercise");
    record127.set("formTips", "Controlled rotation, constant tension");
    record127.set("recommendedSetsReps", "3 sets x 12-15 reps per side");
  try {
    app.save(record127);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record128 = new Record(collection);
    record128.set("name", "Treadmill Running");
    record128.set("equipment", "Cardio Equipment");
    record128.set("muscleGroup", "Cardio");
    record128.set("description", "Classic cardio exercise");
    record128.set("formTips", "Maintain steady pace, proper form");
    record128.set("recommendedSetsReps", "20-60 minutes at moderate intensity");
  try {
    app.save(record128);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record129 = new Record(collection);
    record129.set("name", "Incline Treadmill Walking");
    record129.set("equipment", "Cardio Equipment");
    record129.set("muscleGroup", "Cardio");
    record129.set("description", "Incline walking cardio");
    record129.set("formTips", "Maintain steady pace, upright posture");
    record129.set("recommendedSetsReps", "20-40 minutes at moderate intensity");
  try {
    app.save(record129);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record130 = new Record(collection);
    record130.set("name", "Stationary Bike");
    record130.set("equipment", "Cardio Equipment");
    record130.set("muscleGroup", "Cardio");
    record130.set("description", "Low-impact cardio exercise");
    record130.set("formTips", "Maintain steady pace, proper seat height");
    record130.set("recommendedSetsReps", "20-60 minutes at moderate intensity");
  try {
    app.save(record130);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record131 = new Record(collection);
    record131.set("name", "Rowing Machine");
    record131.set("equipment", "Cardio Equipment");
    record131.set("muscleGroup", "Cardio");
    record131.set("description", "Full-body cardio exercise");
    record131.set("formTips", "Proper form, controlled movement");
    record131.set("recommendedSetsReps", "20-40 minutes at moderate intensity");
  try {
    app.save(record131);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record132 = new Record(collection);
    record132.set("name", "Elliptical Machine");
    record132.set("equipment", "Cardio Equipment");
    record132.set("muscleGroup", "Cardio");
    record132.set("description", "Low-impact cardio machine");
    record132.set("formTips", "Maintain steady pace, proper form");
    record132.set("recommendedSetsReps", "20-60 minutes at moderate intensity");
  try {
    app.save(record132);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record133 = new Record(collection);
    record133.set("name", "Stair Climber");
    record133.set("equipment", "Cardio Equipment");
    record133.set("muscleGroup", "Cardio");
    record133.set("description", "Intense leg and cardio exercise");
    record133.set("formTips", "Maintain steady pace, upright posture");
    record133.set("recommendedSetsReps", "15-30 minutes at moderate intensity");
  try {
    app.save(record133);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record134 = new Record(collection);
    record134.set("name", "Jump Rope");
    record134.set("equipment", "Bodyweight");
    record134.set("muscleGroup", "Cardio");
    record134.set("description", "High-intensity cardio exercise");
    record134.set("formTips", "Controlled jumps, proper form");
    record134.set("recommendedSetsReps", "3 sets x 30-60 seconds");
  try {
    app.save(record134);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record135 = new Record(collection);
    record135.set("name", "Burpees");
    record135.set("equipment", "Bodyweight");
    record135.set("muscleGroup", "Cardio");
    record135.set("description", "Full-body cardio exercise");
    record135.set("formTips", "Controlled movement, full range of motion");
    record135.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record135);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record136 = new Record(collection);
    record136.set("name", "Mountain Climbers");
    record136.set("equipment", "Bodyweight");
    record136.set("muscleGroup", "Cardio");
    record136.set("description", "Core and cardio exercise");
    record136.set("formTips", "Controlled movement, maintain plank position");
    record136.set("recommendedSetsReps", "3 sets x 20-30 reps");
  try {
    app.save(record136);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record137 = new Record(collection);
    record137.set("name", "High Knees");
    record137.set("equipment", "Bodyweight");
    record137.set("muscleGroup", "Cardio");
    record137.set("description", "Cardio and leg exercise");
    record137.set("formTips", "Drive knees up, maintain pace");
    record137.set("recommendedSetsReps", "3 sets x 30-45 seconds");
  try {
    app.save(record137);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record138 = new Record(collection);
    record138.set("name", "Jumping Jacks");
    record138.set("equipment", "Bodyweight");
    record138.set("muscleGroup", "Cardio");
    record138.set("description", "Classic cardio exercise");
    record138.set("formTips", "Controlled movement, full range of motion");
    record138.set("recommendedSetsReps", "3 sets x 20-30 reps");
  try {
    app.save(record138);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record139 = new Record(collection);
    record139.set("name", "Box Jumps");
    record139.set("equipment", "Bench");
    record139.set("muscleGroup", "Cardio");
    record139.set("description", "Explosive cardio exercise");
    record139.set("formTips", "Explosive jump, controlled landing");
    record139.set("recommendedSetsReps", "3 sets x 5-10 reps");
  try {
    app.save(record139);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record140 = new Record(collection);
    record140.set("name", "Sprints");
    record140.set("equipment", "Bodyweight");
    record140.set("muscleGroup", "Cardio");
    record140.set("description", "High-intensity cardio exercise");
    record140.set("formTips", "Maximum effort, controlled form");
    record140.set("recommendedSetsReps", "5-10 x 30-60 second sprints");
  try {
    app.save(record140);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record141 = new Record(collection);
    record141.set("name", "Battle Ropes");
    record141.set("equipment", "Bodyweight");
    record141.set("muscleGroup", "Cardio");
    record141.set("description", "Full-body cardio exercise");
    record141.set("formTips", "Controlled movement, maintain pace");
    record141.set("recommendedSetsReps", "3 sets x 30-45 seconds");
  try {
    app.save(record141);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record142 = new Record(collection);
    record142.set("name", "Sled Push");
    record142.set("equipment", "Machine");
    record142.set("muscleGroup", "Cardio");
    record142.set("description", "Intense leg and cardio exercise");
    record142.set("formTips", "Explosive push, controlled form");
    record142.set("recommendedSetsReps", "3 sets x 20-40 meters");
  try {
    app.save(record142);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record143 = new Record(collection);
    record143.set("name", "Sled Pull");
    record143.set("equipment", "Machine");
    record143.set("muscleGroup", "Cardio");
    record143.set("description", "Intense leg and cardio exercise");
    record143.set("formTips", "Controlled pull, maintain pace");
    record143.set("recommendedSetsReps", "3 sets x 20-40 meters");
  try {
    app.save(record143);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record144 = new Record(collection);
    record144.set("name", "Kettlebell Swings");
    record144.set("equipment", "Kettlebell");
    record144.set("muscleGroup", "Cardio");
    record144.set("description", "Full-body cardio and strength");
    record144.set("formTips", "Hip hinge, explosive movement");
    record144.set("recommendedSetsReps", "3 sets x 15-20 reps");
  try {
    app.save(record144);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record145 = new Record(collection);
    record145.set("name", "Kettlebell Snatches");
    record145.set("equipment", "Kettlebell");
    record145.set("muscleGroup", "Cardio");
    record145.set("description", "Explosive full-body exercise");
    record145.set("formTips", "Explosive movement, controlled descent");
    record145.set("recommendedSetsReps", "3 sets x 8-12 reps per arm");
  try {
    app.save(record145);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record146 = new Record(collection);
    record146.set("name", "Kettlebell Turkish Get-ups");
    record146.set("equipment", "Kettlebell");
    record146.set("muscleGroup", "Full Body");
    record146.set("description", "Complex full-body movement");
    record146.set("formTips", "Controlled movement, maintain eye contact with weight");
    record146.set("recommendedSetsReps", "3 sets x 3-5 reps per side");
  try {
    app.save(record146);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record147 = new Record(collection);
    record147.set("name", "Kettlebell Goblet Squats");
    record147.set("equipment", "Kettlebell");
    record147.set("muscleGroup", "Legs");
    record147.set("description", "Kettlebell squat variation");
    record147.set("formTips", "Chest up, full depth, controlled descent");
    record147.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record147);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record148 = new Record(collection);
    record148.set("name", "Kettlebell Rows");
    record148.set("equipment", "Kettlebell");
    record148.set("muscleGroup", "Back");
    record148.set("description", "Kettlebell row variation");
    record148.set("formTips", "Retract scapula, full range of motion");
    record148.set("recommendedSetsReps", "3 sets x 8-12 reps per arm");
  try {
    app.save(record148);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record149 = new Record(collection);
    record149.set("name", "Kettlebell Presses");
    record149.set("equipment", "Kettlebell");
    record149.set("muscleGroup", "Shoulders");
    record149.set("description", "Kettlebell shoulder press");
    record149.set("formTips", "Chest up, press straight up");
    record149.set("recommendedSetsReps", "3 sets x 8-12 reps per arm");
  try {
    app.save(record149);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record150 = new Record(collection);
    record150.set("name", "Kettlebell Cleans");
    record150.set("equipment", "Kettlebell");
    record150.set("muscleGroup", "Full Body");
    record150.set("description", "Explosive kettlebell movement");
    record150.set("formTips", "Explosive movement, controlled descent");
    record150.set("recommendedSetsReps", "3 sets x 8-12 reps per arm");
  try {
    app.save(record150);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record151 = new Record(collection);
    record151.set("name", "Kettlebell Jerks");
    record151.set("equipment", "Kettlebell");
    record151.set("muscleGroup", "Full Body");
    record151.set("description", "Advanced kettlebell exercise");
    record151.set("formTips", "Explosive movement, controlled descent");
    record151.set("recommendedSetsReps", "3 sets x 5-8 reps per arm");
  try {
    app.save(record151);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record152 = new Record(collection);
    record152.set("name", "Kettlebell Windmills");
    record152.set("equipment", "Kettlebell");
    record152.set("muscleGroup", "Shoulders");
    record152.set("description", "Complex shoulder exercise");
    record152.set("formTips", "Controlled movement, maintain eye contact with weight");
    record152.set("recommendedSetsReps", "3 sets x 5-8 reps per side");
  try {
    app.save(record152);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record153 = new Record(collection);
    record153.set("name", "Kettlebell Figure-8s");
    record153.set("equipment", "Kettlebell");
    record153.set("muscleGroup", "Full Body");
    record153.set("description", "Coordination and grip exercise");
    record153.set("formTips", "Controlled movement, maintain pace");
    record153.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record153);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record154 = new Record(collection);
    record154.set("name", "Resistance Band Squats");
    record154.set("equipment", "Bands");
    record154.set("muscleGroup", "Legs");
    record154.set("description", "Band-based squat variation");
    record154.set("formTips", "Full range of motion, constant tension");
    record154.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record154);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record155 = new Record(collection);
    record155.set("name", "Resistance Band Deadlifts");
    record155.set("equipment", "Bands");
    record155.set("muscleGroup", "Legs");
    record155.set("description", "Band-based deadlift variation");
    record155.set("formTips", "Full range of motion, controlled tempo");
    record155.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record155);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record156 = new Record(collection);
    record156.set("name", "Resistance Band Chest Press");
    record156.set("equipment", "Bands");
    record156.set("muscleGroup", "Chest");
    record156.set("description", "Band-based chest press");
    record156.set("formTips", "Full range of motion, constant tension");
    record156.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record156);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record157 = new Record(collection);
    record157.set("name", "Resistance Band Shoulder Press");
    record157.set("equipment", "Bands");
    record157.set("muscleGroup", "Shoulders");
    record157.set("description", "Band-based shoulder press");
    record157.set("formTips", "Full range of motion, constant tension");
    record157.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record157);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record158 = new Record(collection);
    record158.set("name", "Resistance Band Lateral Raises");
    record158.set("equipment", "Bands");
    record158.set("muscleGroup", "Shoulders");
    record158.set("description", "Band-based lateral raise");
    record158.set("formTips", "Controlled movement, constant tension");
    record158.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record158);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record159 = new Record(collection);
    record159.set("name", "Resistance Band Pull-aparts");
    record159.set("equipment", "Bands");
    record159.set("muscleGroup", "Back");
    record159.set("description", "Band-based pull-apart");
    record159.set("formTips", "Controlled movement, squeeze at peak");
    record159.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record159);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record160 = new Record(collection);
    record160.set("name", "Resistance Band Face Pulls");
    record160.set("equipment", "Bands");
    record160.set("muscleGroup", "Back");
    record160.set("description", "Band-based face pull");
    record160.set("formTips", "Controlled movement, squeeze at peak");
    record160.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record160);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record161 = new Record(collection);
    record161.set("name", "Yoga");
    record161.set("equipment", "Bodyweight");
    record161.set("muscleGroup", "Flexibility");
    record161.set("description", "Flexibility and balance exercise");
    record161.set("formTips", "Controlled breathing, proper alignment");
    record161.set("recommendedSetsReps", "30-60 minutes");
  try {
    app.save(record161);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record162 = new Record(collection);
    record162.set("name", "Stretching");
    record162.set("equipment", "Bodyweight");
    record162.set("muscleGroup", "Flexibility");
    record162.set("description", "General stretching routine");
    record162.set("formTips", "Hold stretches, controlled breathing");
    record162.set("recommendedSetsReps", "10-15 minutes");
  try {
    app.save(record162);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record163 = new Record(collection);
    record163.set("name", "Foam Rolling");
    record163.set("equipment", "Bodyweight");
    record163.set("muscleGroup", "Flexibility");
    record163.set("description", "Self-myofascial release");
    record163.set("formTips", "Slow controlled movements, breathe");
    record163.set("recommendedSetsReps", "10-15 minutes");
  try {
    app.save(record163);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record164 = new Record(collection);
    record164.set("name", "Pilates");
    record164.set("equipment", "Bodyweight");
    record164.set("muscleGroup", "Flexibility");
    record164.set("description", "Core and flexibility exercise");
    record164.set("formTips", "Controlled breathing, proper form");
    record164.set("recommendedSetsReps", "30-45 minutes");
  try {
    app.save(record164);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record165 = new Record(collection);
    record165.set("name", "Cat-Cow Stretch");
    record165.set("equipment", "Bodyweight");
    record165.set("muscleGroup", "Flexibility");
    record165.set("description", "Spinal mobility exercise");
    record165.set("formTips", "Controlled movement, full range of motion");
    record165.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record165);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record166 = new Record(collection);
    record166.set("name", "Child's Pose");
    record166.set("equipment", "Bodyweight");
    record166.set("muscleGroup", "Flexibility");
    record166.set("description", "Relaxation and back stretch");
    record166.set("formTips", "Controlled breathing, relax into stretch");
    record166.set("recommendedSetsReps", "Hold 30-60 seconds");
  try {
    app.save(record166);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record167 = new Record(collection);
    record167.set("name", "Downward Dog");
    record167.set("equipment", "Bodyweight");
    record167.set("muscleGroup", "Flexibility");
    record167.set("description", "Full-body stretch");
    record167.set("formTips", "Controlled breathing, proper alignment");
    record167.set("recommendedSetsReps", "Hold 30-60 seconds");
  try {
    app.save(record167);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record168 = new Record(collection);
    record168.set("name", "Hamstring Stretch");
    record168.set("equipment", "Bodyweight");
    record168.set("muscleGroup", "Flexibility");
    record168.set("description", "Hamstring flexibility exercise");
    record168.set("formTips", "Hold stretch, controlled breathing");
    record168.set("recommendedSetsReps", "Hold 30-45 seconds per leg");
  try {
    app.save(record168);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record169 = new Record(collection);
    record169.set("name", "Quad Stretch");
    record169.set("equipment", "Bodyweight");
    record169.set("muscleGroup", "Flexibility");
    record169.set("description", "Quadriceps flexibility exercise");
    record169.set("formTips", "Hold stretch, maintain balance");
    record169.set("recommendedSetsReps", "Hold 30-45 seconds per leg");
  try {
    app.save(record169);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record170 = new Record(collection);
    record170.set("name", "Hip Flexor Stretch");
    record170.set("equipment", "Bodyweight");
    record170.set("muscleGroup", "Flexibility");
    record170.set("description", "Hip flexor flexibility exercise");
    record170.set("formTips", "Hold stretch, controlled breathing");
    record170.set("recommendedSetsReps", "Hold 30-45 seconds per side");
  try {
    app.save(record170);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record171 = new Record(collection);
    record171.set("name", "Shoulder Stretch");
    record171.set("equipment", "Bodyweight");
    record171.set("muscleGroup", "Flexibility");
    record171.set("description", "Shoulder flexibility exercise");
    record171.set("formTips", "Hold stretch, controlled breathing");
    record171.set("recommendedSetsReps", "Hold 30-45 seconds per side");
  try {
    app.save(record171);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record172 = new Record(collection);
    record172.set("name", "Chest Stretch");
    record172.set("equipment", "Bodyweight");
    record172.set("muscleGroup", "Flexibility");
    record172.set("description", "Chest flexibility exercise");
    record172.set("formTips", "Hold stretch, controlled breathing");
    record172.set("recommendedSetsReps", "Hold 30-45 seconds");
  try {
    app.save(record172);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record173 = new Record(collection);
    record173.set("name", "Back Stretch");
    record173.set("equipment", "Bodyweight");
    record173.set("muscleGroup", "Flexibility");
    record173.set("description", "Back flexibility exercise");
    record173.set("formTips", "Hold stretch, controlled breathing");
    record173.set("recommendedSetsReps", "Hold 30-45 seconds");
  try {
    app.save(record173);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record174 = new Record(collection);
    record174.set("name", "Tricep Stretch");
    record174.set("equipment", "Bodyweight");
    record174.set("muscleGroup", "Flexibility");
    record174.set("description", "Tricep flexibility exercise");
    record174.set("formTips", "Hold stretch, controlled breathing");
    record174.set("recommendedSetsReps", "Hold 30-45 seconds per arm");
  try {
    app.save(record174);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record175 = new Record(collection);
    record175.set("name", "Bicep Stretch");
    record175.set("equipment", "Bodyweight");
    record175.set("muscleGroup", "Flexibility");
    record175.set("description", "Bicep flexibility exercise");
    record175.set("formTips", "Hold stretch, controlled breathing");
    record175.set("recommendedSetsReps", "Hold 30-45 seconds per arm");
  try {
    app.save(record175);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record176 = new Record(collection);
    record176.set("name", "Glute Stretch");
    record176.set("equipment", "Bodyweight");
    record176.set("muscleGroup", "Flexibility");
    record176.set("description", "Glute flexibility exercise");
    record176.set("formTips", "Hold stretch, controlled breathing");
    record176.set("recommendedSetsReps", "Hold 30-45 seconds per side");
  try {
    app.save(record176);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record177 = new Record(collection);
    record177.set("name", "Calf Stretch");
    record177.set("equipment", "Bodyweight");
    record177.set("muscleGroup", "Flexibility");
    record177.set("description", "Calf flexibility exercise");
    record177.set("formTips", "Hold stretch, controlled breathing");
    record177.set("recommendedSetsReps", "Hold 30-45 seconds per leg");
  try {
    app.save(record177);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record178 = new Record(collection);
    record178.set("name", "Spinal Twist");
    record178.set("equipment", "Bodyweight");
    record178.set("muscleGroup", "Flexibility");
    record178.set("description", "Spinal mobility and stretch");
    record178.set("formTips", "Controlled rotation, hold stretch");
    record178.set("recommendedSetsReps", "Hold 30-45 seconds per side");
  try {
    app.save(record178);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record179 = new Record(collection);
    record179.set("name", "Butterfly Stretch");
    record179.set("equipment", "Bodyweight");
    record179.set("muscleGroup", "Flexibility");
    record179.set("description", "Hip and groin stretch");
    record179.set("formTips", "Hold stretch, controlled breathing");
    record179.set("recommendedSetsReps", "Hold 30-60 seconds");
  try {
    app.save(record179);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record180 = new Record(collection);
    record180.set("name", "Pigeon Pose");
    record180.set("equipment", "Bodyweight");
    record180.set("muscleGroup", "Flexibility");
    record180.set("description", "Hip and glute stretch");
    record180.set("formTips", "Hold stretch, controlled breathing");
    record180.set("recommendedSetsReps", "Hold 30-60 seconds per side");
  try {
    app.save(record180);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record181 = new Record(collection);
    record181.set("name", "Lunges with Twist");
    record181.set("equipment", "Bodyweight");
    record181.set("muscleGroup", "Flexibility");
    record181.set("description", "Dynamic stretch and mobility");
    record181.set("formTips", "Controlled movement, full range of motion");
    record181.set("recommendedSetsReps", "3 sets x 8-10 reps per side");
  try {
    app.save(record181);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record182 = new Record(collection);
    record182.set("name", "Inchworms");
    record182.set("equipment", "Bodyweight");
    record182.set("muscleGroup", "Flexibility");
    record182.set("description", "Dynamic full-body stretch");
    record182.set("formTips", "Controlled movement, full range of motion");
    record182.set("recommendedSetsReps", "3 sets x 8-10 reps");
  try {
    app.save(record182);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record183 = new Record(collection);
    record183.set("name", "Leg Swings");
    record183.set("equipment", "Bodyweight");
    record183.set("muscleGroup", "Flexibility");
    record183.set("description", "Dynamic leg mobility exercise");
    record183.set("formTips", "Controlled swings, full range of motion");
    record183.set("recommendedSetsReps", "3 sets x 10-15 reps per leg");
  try {
    app.save(record183);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record184 = new Record(collection);
    record184.set("name", "Arm Circles");
    record184.set("equipment", "Bodyweight");
    record184.set("muscleGroup", "Flexibility");
    record184.set("description", "Dynamic shoulder mobility");
    record184.set("formTips", "Controlled circles, full range of motion");
    record184.set("recommendedSetsReps", "3 sets x 10-15 reps per direction");
  try {
    app.save(record184);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record185 = new Record(collection);
    record185.set("name", "Torso Twists");
    record185.set("equipment", "Bodyweight");
    record185.set("muscleGroup", "Flexibility");
    record185.set("description", "Dynamic spinal mobility");
    record185.set("formTips", "Controlled rotation, full range of motion");
    record185.set("recommendedSetsReps", "3 sets x 15-20 reps");
  try {
    app.save(record185);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record186 = new Record(collection);
    record186.set("name", "Jumping Lunges");
    record186.set("equipment", "Bodyweight");
    record186.set("muscleGroup", "Full Body");
    record186.set("description", "Explosive leg and cardio exercise");
    record186.set("formTips", "Explosive movement, controlled landing");
    record186.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record186);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record187 = new Record(collection);
    record187.set("name", "Lateral Bounds");
    record187.set("equipment", "Bodyweight");
    record187.set("muscleGroup", "Full Body");
    record187.set("description", "Explosive lateral movement");
    record187.set("formTips", "Explosive movement, controlled landing");
    record187.set("recommendedSetsReps", "3 sets x 8-12 reps per side");
  try {
    app.save(record187);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record188 = new Record(collection);
    record188.set("name", "Broad Jumps");
    record188.set("equipment", "Bodyweight");
    record188.set("muscleGroup", "Full Body");
    record188.set("description", "Explosive full-body exercise");
    record188.set("formTips", "Explosive jump, controlled landing");
    record188.set("recommendedSetsReps", "3 sets x 5-10 reps");
  try {
    app.save(record188);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record189 = new Record(collection);
    record189.set("name", "Medicine Ball Slams");
    record189.set("equipment", "Dumbbell");
    record189.set("muscleGroup", "Full Body");
    record189.set("description", "Explosive full-body exercise");
    record189.set("formTips", "Explosive movement, controlled form");
    record189.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record189);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record190 = new Record(collection);
    record190.set("name", "Medicine Ball Chest Pass");
    record190.set("equipment", "Dumbbell");
    record190.set("muscleGroup", "Chest");
    record190.set("description", "Explosive chest exercise");
    record190.set("formTips", "Explosive push, controlled catch");
    record190.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record190);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record191 = new Record(collection);
    record191.set("name", "Medicine Ball Rotations");
    record191.set("equipment", "Dumbbell");
    record191.set("muscleGroup", "Abs-Core");
    record191.set("description", "Rotational core exercise");
    record191.set("formTips", "Controlled rotation, explosive movement");
    record191.set("recommendedSetsReps", "3 sets x 10-12 reps per side");
  try {
    app.save(record191);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record192 = new Record(collection);
    record192.set("name", "Landmine Press");
    record192.set("equipment", "Barbell");
    record192.set("muscleGroup", "Shoulders");
    record192.set("description", "Angled shoulder press");
    record192.set("formTips", "Full range of motion, controlled tempo");
    record192.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record192);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record193 = new Record(collection);
    record193.set("name", "Landmine Rows");
    record193.set("equipment", "Barbell");
    record193.set("muscleGroup", "Back");
    record193.set("description", "Angled row variation");
    record193.set("formTips", "Full range of motion, controlled tempo");
    record193.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record193);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record194 = new Record(collection);
    record194.set("name", "Landmine Squats");
    record194.set("equipment", "Barbell");
    record194.set("muscleGroup", "Legs");
    record194.set("description", "Angled squat variation");
    record194.set("formTips", "Full range of motion, controlled descent");
    record194.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record194);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record195 = new Record(collection);
    record195.set("name", "Sled Sprints");
    record195.set("equipment", "Machine");
    record195.set("muscleGroup", "Cardio");
    record195.set("description", "Intense leg and cardio exercise");
    record195.set("formTips", "Explosive push, controlled form");
    record195.set("recommendedSetsReps", "5-10 x 20-40 meter sprints");
  try {
    app.save(record195);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record196 = new Record(collection);
    record196.set("name", "Farmer's Carry");
    record196.set("equipment", "Dumbbell");
    record196.set("muscleGroup", "Full Body");
    record196.set("description", "Grip and core strength exercise");
    record196.set("formTips", "Upright posture, controlled movement");
    record196.set("recommendedSetsReps", "3 sets x 30-60 meters");
  try {
    app.save(record196);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record197 = new Record(collection);
    record197.set("name", "Weighted Farmer's Carry");
    record197.set("equipment", "Barbell");
    record197.set("muscleGroup", "Full Body");
    record197.set("description", "Heavy farmer's carry variation");
    record197.set("formTips", "Upright posture, controlled movement");
    record197.set("recommendedSetsReps", "3 sets x 30-60 meters");
  try {
    app.save(record197);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record198 = new Record(collection);
    record198.set("name", "Suitcase Carries");
    record198.set("equipment", "Dumbbell");
    record198.set("muscleGroup", "Abs-Core");
    record198.set("description", "Unilateral core exercise");
    record198.set("formTips", "Upright posture, engage core");
    record198.set("recommendedSetsReps", "3 sets x 30-60 meters per side");
  try {
    app.save(record198);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record199 = new Record(collection);
    record199.set("name", "Bear Crawls");
    record199.set("equipment", "Bodyweight");
    record199.set("muscleGroup", "Full Body");
    record199.set("description", "Full-body cardio and strength");
    record199.set("formTips", "Controlled movement, maintain form");
    record199.set("recommendedSetsReps", "3 sets x 20-40 meters");
  try {
    app.save(record199);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record200 = new Record(collection);
    record200.set("name", "Crab Walks");
    record200.set("equipment", "Bodyweight");
    record200.set("muscleGroup", "Full Body");
    record200.set("description", "Full-body strength exercise");
    record200.set("formTips", "Controlled movement, maintain form");
    record200.set("recommendedSetsReps", "3 sets x 20-40 meters");
  try {
    app.save(record200);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record201 = new Record(collection);
    record201.set("name", "Crawling Variations");
    record201.set("equipment", "Bodyweight");
    record201.set("muscleGroup", "Full Body");
    record201.set("description", "Various crawling movements");
    record201.set("formTips", "Controlled movement, maintain form");
    record201.set("recommendedSetsReps", "3 sets x 20-40 meters");
  try {
    app.save(record201);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record202 = new Record(collection);
    record202.set("name", "Sled Drags");
    record202.set("equipment", "Machine");
    record202.set("muscleGroup", "Full Body");
    record202.set("description", "Full-body strength and cardio");
    record202.set("formTips", "Controlled movement, maintain pace");
    record202.set("recommendedSetsReps", "3 sets x 30-60 meters");
  try {
    app.save(record202);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record203 = new Record(collection);
    record203.set("name", "Tire Flips");
    record203.set("equipment", "Bodyweight");
    record203.set("muscleGroup", "Full Body");
    record203.set("description", "Explosive full-body exercise");
    record203.set("formTips", "Explosive movement, controlled form");
    record203.set("recommendedSetsReps", "3 sets x 5-10 reps");
  try {
    app.save(record203);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record204 = new Record(collection);
    record204.set("name", "Rope Climbs");
    record204.set("equipment", "Pull-up Bar");
    record204.set("muscleGroup", "Full Body");
    record204.set("description", "Full-body strength exercise");
    record204.set("formTips", "Controlled movement, proper technique");
    record204.set("recommendedSetsReps", "3 sets x 3-5 climbs");
  try {
    app.save(record204);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record205 = new Record(collection);
    record205.set("name", "Wall Sits");
    record205.set("equipment", "Bodyweight");
    record205.set("muscleGroup", "Legs");
    record205.set("description", "Isometric leg exercise");
    record205.set("formTips", "Back against wall, knees at 90 degrees");
    record205.set("recommendedSetsReps", "3 sets x 30-60 seconds");
  try {
    app.save(record205);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record206 = new Record(collection);
    record206.set("name", "Glute Bridges");
    record206.set("equipment", "Bodyweight");
    record206.set("muscleGroup", "Legs");
    record206.set("description", "Glute activation exercise");
    record206.set("formTips", "Full range of motion, squeeze at top");
    record206.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record206);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record207 = new Record(collection);
    record207.set("name", "Single-Leg Glute Bridges");
    record207.set("equipment", "Bodyweight");
    record207.set("muscleGroup", "Legs");
    record207.set("description", "Unilateral glute exercise");
    record207.set("formTips", "Full range of motion, controlled movement");
    record207.set("recommendedSetsReps", "3 sets x 10-12 reps per leg");
  try {
    app.save(record207);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record208 = new Record(collection);
    record208.set("name", "Weighted Glute Bridges");
    record208.set("equipment", "Dumbbell");
    record208.set("muscleGroup", "Legs");
    record208.set("description", "Weighted glute bridge");
    record208.set("formTips", "Full range of motion, squeeze at top");
    record208.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record208);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record209 = new Record(collection);
    record209.set("name", "Hip Thrusts");
    record209.set("equipment", "Bench");
    record209.set("muscleGroup", "Legs");
    record209.set("description", "Glute-focused exercise");
    record209.set("formTips", "Full range of motion, squeeze at top");
    record209.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record209);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record210 = new Record(collection);
    record210.set("name", "Barbell Hip Thrusts");
    record210.set("equipment", "Barbell");
    record210.set("muscleGroup", "Legs");
    record210.set("description", "Barbell hip thrust");
    record210.set("formTips", "Full range of motion, squeeze at top");
    record210.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record210);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record211 = new Record(collection);
    record211.set("name", "Dumbbell Hip Thrusts");
    record211.set("equipment", "Dumbbell");
    record211.set("muscleGroup", "Legs");
    record211.set("description", "Dumbbell hip thrust");
    record211.set("formTips", "Full range of motion, controlled movement");
    record211.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record211);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record212 = new Record(collection);
    record212.set("name", "Machine Hip Thrusts");
    record212.set("equipment", "Machine");
    record212.set("muscleGroup", "Legs");
    record212.set("description", "Machine-based hip thrust");
    record212.set("formTips", "Full range of motion, squeeze at top");
    record212.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record212);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record213 = new Record(collection);
    record213.set("name", "Step-ups");
    record213.set("equipment", "Bench");
    record213.set("muscleGroup", "Legs");
    record213.set("description", "Single-leg leg exercise");
    record213.set("formTips", "Full range of motion, controlled movement");
    record213.set("recommendedSetsReps", "3 sets x 10-12 reps per leg");
  try {
    app.save(record213);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record214 = new Record(collection);
    record214.set("name", "Dumbbell Step-ups");
    record214.set("equipment", "Dumbbell");
    record214.set("muscleGroup", "Legs");
    record214.set("description", "Weighted step-up variation");
    record214.set("formTips", "Full range of motion, controlled movement");
    record214.set("recommendedSetsReps", "3 sets x 8-12 reps per leg");
  try {
    app.save(record214);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record215 = new Record(collection);
    record215.set("name", "Barbell Step-ups");
    record215.set("equipment", "Barbell");
    record215.set("muscleGroup", "Legs");
    record215.set("description", "Barbell step-up variation");
    record215.set("formTips", "Full range of motion, controlled descent");
    record215.set("recommendedSetsReps", "3 sets x 8-10 reps per leg");
  try {
    app.save(record215);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record216 = new Record(collection);
    record216.set("name", "Box Step-ups");
    record216.set("equipment", "Bench");
    record216.set("muscleGroup", "Legs");
    record216.set("description", "Box-based step-up");
    record216.set("formTips", "Full range of motion, controlled movement");
    record216.set("recommendedSetsReps", "3 sets x 10-12 reps per leg");
  try {
    app.save(record216);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record217 = new Record(collection);
    record217.set("name", "Lateral Step-ups");
    record217.set("equipment", "Bench");
    record217.set("muscleGroup", "Legs");
    record217.set("description", "Lateral step-up variation");
    record217.set("formTips", "Full range of motion, controlled movement");
    record217.set("recommendedSetsReps", "3 sets x 10-12 reps per leg");
  try {
    app.save(record217);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record218 = new Record(collection);
    record218.set("name", "Reverse Step-ups");
    record218.set("equipment", "Bench");
    record218.set("muscleGroup", "Legs");
    record218.set("description", "Reverse step-up variation");
    record218.set("formTips", "Full range of motion, controlled movement");
    record218.set("recommendedSetsReps", "3 sets x 10-12 reps per leg");
  try {
    app.save(record218);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record219 = new Record(collection);
    record219.set("name", "Sled Leg Press");
    record219.set("equipment", "Machine");
    record219.set("muscleGroup", "Legs");
    record219.set("description", "Machine-based leg press variation");
    record219.set("formTips", "Full range of motion, controlled tempo");
    record219.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record219);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record220 = new Record(collection);
    record220.set("name", "V-Squat Machine");
    record220.set("equipment", "Machine");
    record220.set("muscleGroup", "Legs");
    record220.set("description", "V-shaped squat machine");
    record220.set("formTips", "Full range of motion, controlled descent");
    record220.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record220);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record221 = new Record(collection);
    record221.set("name", "Pendulum Squat Machine");
    record221.set("equipment", "Machine");
    record221.set("muscleGroup", "Legs");
    record221.set("description", "Pendulum-based squat machine");
    record221.set("formTips", "Full range of motion, controlled tempo");
    record221.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record221);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record222 = new Record(collection);
    record222.set("name", "Leg Sled Machine");
    record222.set("equipment", "Machine");
    record222.set("muscleGroup", "Legs");
    record222.set("description", "Sled-based leg machine");
    record222.set("formTips", "Full range of motion, controlled tempo");
    record222.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record222);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record223 = new Record(collection);
    record223.set("name", "Smith Machine Leg Press");
    record223.set("equipment", "Machine");
    record223.set("muscleGroup", "Legs");
    record223.set("description", "Smith machine leg press");
    record223.set("formTips", "Full range of motion, controlled tempo");
    record223.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record223);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record224 = new Record(collection);
    record224.set("name", "Hack Squat Machine");
    record224.set("equipment", "Machine");
    record224.set("muscleGroup", "Legs");
    record224.set("description", "Hack squat machine variation");
    record224.set("formTips", "Full range of motion, controlled descent");
    record224.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record224);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record225 = new Record(collection);
    record225.set("name", "Leg Press Machine");
    record225.set("equipment", "Machine");
    record225.set("muscleGroup", "Legs");
    record225.set("description", "Standard leg press machine");
    record225.set("formTips", "Full range of motion, controlled tempo");
    record225.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record225);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record226 = new Record(collection);
    record226.set("name", "Adductor Machine");
    record226.set("equipment", "Machine");
    record226.set("muscleGroup", "Legs");
    record226.set("description", "Inner thigh isolation machine");
    record226.set("formTips", "Full range of motion, squeeze at peak");
    record226.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record226);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record227 = new Record(collection);
    record227.set("name", "Abductor Machine");
    record227.set("equipment", "Machine");
    record227.set("muscleGroup", "Legs");
    record227.set("description", "Outer thigh isolation machine");
    record227.set("formTips", "Full range of motion, squeeze at peak");
    record227.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record227);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record228 = new Record(collection);
    record228.set("name", "Cable Kickbacks");
    record228.set("equipment", "Cable");
    record228.set("muscleGroup", "Legs");
    record228.set("description", "Cable-based glute exercise");
    record228.set("formTips", "Full range of motion, squeeze at top");
    record228.set("recommendedSetsReps", "3 sets x 10-15 reps per leg");
  try {
    app.save(record228);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record229 = new Record(collection);
    record229.set("name", "Machine Kickbacks");
    record229.set("equipment", "Machine");
    record229.set("muscleGroup", "Legs");
    record229.set("description", "Machine-based glute exercise");
    record229.set("formTips", "Full range of motion, squeeze at top");
    record229.set("recommendedSetsReps", "3 sets x 10-15 reps per leg");
  try {
    app.save(record229);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record230 = new Record(collection);
    record230.set("name", "Dumbbell Kickbacks");
    record230.set("equipment", "Dumbbell");
    record230.set("muscleGroup", "Legs");
    record230.set("description", "Dumbbell glute exercise");
    record230.set("formTips", "Full range of motion, squeeze at top");
    record230.set("recommendedSetsReps", "3 sets x 10-15 reps per leg");
  try {
    app.save(record230);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record231 = new Record(collection);
    record231.set("name", "Cable Abductions");
    record231.set("equipment", "Cable");
    record231.set("muscleGroup", "Legs");
    record231.set("description", "Cable-based abduction exercise");
    record231.set("formTips", "Full range of motion, squeeze at peak");
    record231.set("recommendedSetsReps", "3 sets x 10-15 reps per leg");
  try {
    app.save(record231);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record232 = new Record(collection);
    record232.set("name", "Cable Adductions");
    record232.set("equipment", "Cable");
    record232.set("muscleGroup", "Legs");
    record232.set("description", "Cable-based adduction exercise");
    record232.set("formTips", "Full range of motion, squeeze at peak");
    record232.set("recommendedSetsReps", "3 sets x 10-15 reps per leg");
  try {
    app.save(record232);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record233 = new Record(collection);
    record233.set("name", "Dumbbell Pullovers");
    record233.set("equipment", "Dumbbell");
    record233.set("muscleGroup", "Chest");
    record233.set("description", "Chest and back exercise");
    record233.set("formTips", "Full range of motion, controlled descent");
    record233.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record233);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record234 = new Record(collection);
    record234.set("name", "Machine Pullovers");
    record234.set("equipment", "Machine");
    record234.set("muscleGroup", "Chest");
    record234.set("description", "Machine-based pullover");
    record234.set("formTips", "Full range of motion, controlled tempo");
    record234.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record234);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record235 = new Record(collection);
    record235.set("name", "Cable Pullovers");
    record235.set("equipment", "Cable");
    record235.set("muscleGroup", "Chest");
    record235.set("description", "Cable-based pullover");
    record235.set("formTips", "Full range of motion, squeeze at peak");
    record235.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record235);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record236 = new Record(collection);
    record236.set("name", "Barbell Pullovers");
    record236.set("equipment", "Barbell");
    record236.set("muscleGroup", "Chest");
    record236.set("description", "Barbell pullover variation");
    record236.set("formTips", "Full range of motion, controlled descent");
    record236.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record236);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record237 = new Record(collection);
    record237.set("name", "Incline Dumbbell Flyes");
    record237.set("equipment", "Dumbbell");
    record237.set("muscleGroup", "Chest");
    record237.set("description", "Incline chest fly variation");
    record237.set("formTips", "Slight bend in elbows, full range of motion");
    record237.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record237);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record238 = new Record(collection);
    record238.set("name", "Decline Dumbbell Flyes");
    record238.set("equipment", "Dumbbell");
    record238.set("muscleGroup", "Chest");
    record238.set("description", "Decline chest fly variation");
    record238.set("formTips", "Slight bend in elbows, full range of motion");
    record238.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record238);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record239 = new Record(collection);
    record239.set("name", "Machine Chest Flyes");
    record239.set("equipment", "Machine");
    record239.set("muscleGroup", "Chest");
    record239.set("description", "Machine-based chest fly");
    record239.set("formTips", "Full range of motion, squeeze at peak");
    record239.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record239);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record240 = new Record(collection);
    record240.set("name", "Cable Chest Flyes");
    record240.set("equipment", "Cable");
    record240.set("muscleGroup", "Chest");
    record240.set("description", "Cable-based chest fly");
    record240.set("formTips", "Slight bend in elbows, squeeze at peak");
    record240.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record240);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record241 = new Record(collection);
    record241.set("name", "Resistance Band Chest Flyes");
    record241.set("equipment", "Bands");
    record241.set("muscleGroup", "Chest");
    record241.set("description", "Band-based chest fly");
    record241.set("formTips", "Slight bend in elbows, constant tension");
    record241.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record241);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record242 = new Record(collection);
    record242.set("name", "Dumbbell Flyes");
    record242.set("equipment", "Dumbbell");
    record242.set("muscleGroup", "Chest");
    record242.set("description", "Classic dumbbell chest fly");
    record242.set("formTips", "Slight bend in elbows, full range of motion");
    record242.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record242);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record243 = new Record(collection);
    record243.set("name", "Barbell Bench Press Variations");
    record243.set("equipment", "Barbell");
    record243.set("muscleGroup", "Chest");
    record243.set("description", "Various bench press modifications");
    record243.set("formTips", "Full range of motion, controlled tempo");
    record243.set("recommendedSetsReps", "3 sets x 6-10 reps");
  try {
    app.save(record243);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record244 = new Record(collection);
    record244.set("name", "Dumbbell Bench Press Variations");
    record244.set("equipment", "Dumbbell");
    record244.set("muscleGroup", "Chest");
    record244.set("description", "Various dumbbell press modifications");
    record244.set("formTips", "Full range of motion, controlled descent");
    record244.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record244);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record245 = new Record(collection);
    record245.set("name", "Machine Chest Press Variations");
    record245.set("equipment", "Machine");
    record245.set("muscleGroup", "Chest");
    record245.set("description", "Various machine press modifications");
    record245.set("formTips", "Full range of motion, controlled tempo");
    record245.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record245);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record246 = new Record(collection);
    record246.set("name", "Cable Chest Press Variations");
    record246.set("equipment", "Cable");
    record246.set("muscleGroup", "Chest");
    record246.set("description", "Various cable press modifications");
    record246.set("formTips", "Full range of motion, constant tension");
    record246.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record246);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record247 = new Record(collection);
    record247.set("name", "Resistance Band Chest Press Variations");
    record247.set("equipment", "Bands");
    record247.set("muscleGroup", "Chest");
    record247.set("description", "Various band press modifications");
    record247.set("formTips", "Full range of motion, constant tension");
    record247.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record247);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record248 = new Record(collection);
    record248.set("name", "Barbell Row Variations");
    record248.set("equipment", "Barbell");
    record248.set("muscleGroup", "Back");
    record248.set("description", "Various barbell row modifications");
    record248.set("formTips", "Full range of motion, controlled tempo");
    record248.set("recommendedSetsReps", "3 sets x 6-10 reps");
  try {
    app.save(record248);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record249 = new Record(collection);
    record249.set("name", "Dumbbell Row Variations");
    record249.set("equipment", "Dumbbell");
    record249.set("muscleGroup", "Back");
    record249.set("description", "Various dumbbell row modifications");
    record249.set("formTips", "Full range of motion, controlled descent");
    record249.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record249);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record250 = new Record(collection);
    record250.set("name", "Machine Row Variations");
    record250.set("equipment", "Machine");
    record250.set("muscleGroup", "Back");
    record250.set("description", "Various machine row modifications");
    record250.set("formTips", "Full range of motion, controlled tempo");
    record250.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record250);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record251 = new Record(collection);
    record251.set("name", "Cable Row Variations");
    record251.set("equipment", "Cable");
    record251.set("muscleGroup", "Back");
    record251.set("description", "Various cable row modifications");
    record251.set("formTips", "Full range of motion, constant tension");
    record251.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record251);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record252 = new Record(collection);
    record252.set("name", "Resistance Band Row Variations");
    record252.set("equipment", "Bands");
    record252.set("muscleGroup", "Back");
    record252.set("description", "Various band row modifications");
    record252.set("formTips", "Full range of motion, constant tension");
    record252.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record252);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record253 = new Record(collection);
    record253.set("name", "Barbell Squat Variations");
    record253.set("equipment", "Barbell");
    record253.set("muscleGroup", "Legs");
    record253.set("description", "Various barbell squat modifications");
    record253.set("formTips", "Full range of motion, controlled descent");
    record253.set("recommendedSetsReps", "3 sets x 6-10 reps");
  try {
    app.save(record253);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record254 = new Record(collection);
    record254.set("name", "Dumbbell Squat Variations");
    record254.set("equipment", "Dumbbell");
    record254.set("muscleGroup", "Legs");
    record254.set("description", "Various dumbbell squat modifications");
    record254.set("formTips", "Full range of motion, controlled descent");
    record254.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record254);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record255 = new Record(collection);
    record255.set("name", "Machine Squat Variations");
    record255.set("equipment", "Machine");
    record255.set("muscleGroup", "Legs");
    record255.set("description", "Various machine squat modifications");
    record255.set("formTips", "Full range of motion, controlled tempo");
    record255.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record255);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record256 = new Record(collection);
    record256.set("name", "Bodyweight Squat Variations");
    record256.set("equipment", "Bodyweight");
    record256.set("muscleGroup", "Legs");
    record256.set("description", "Various bodyweight squat modifications");
    record256.set("formTips", "Full range of motion, controlled descent");
    record256.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record256);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record257 = new Record(collection);
    record257.set("name", "Resistance Band Squat Variations");
    record257.set("equipment", "Bands");
    record257.set("muscleGroup", "Legs");
    record257.set("description", "Various band squat modifications");
    record257.set("formTips", "Full range of motion, constant tension");
    record257.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record257);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record258 = new Record(collection);
    record258.set("name", "Barbell Deadlift Variations");
    record258.set("equipment", "Barbell");
    record258.set("muscleGroup", "Legs");
    record258.set("description", "Various barbell deadlift modifications");
    record258.set("formTips", "Full range of motion, controlled tempo");
    record258.set("recommendedSetsReps", "3 sets x 3-8 reps");
  try {
    app.save(record258);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record259 = new Record(collection);
    record259.set("name", "Dumbbell Deadlift Variations");
    record259.set("equipment", "Dumbbell");
    record259.set("muscleGroup", "Legs");
    record259.set("description", "Various dumbbell deadlift modifications");
    record259.set("formTips", "Full range of motion, controlled descent");
    record259.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record259);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record260 = new Record(collection);
    record260.set("name", "Machine Deadlift Variations");
    record260.set("equipment", "Machine");
    record260.set("muscleGroup", "Legs");
    record260.set("description", "Various machine deadlift modifications");
    record260.set("formTips", "Full range of motion, controlled tempo");
    record260.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record260);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record261 = new Record(collection);
    record261.set("name", "Bodyweight Deadlift Variations");
    record261.set("equipment", "Bodyweight");
    record261.set("muscleGroup", "Legs");
    record261.set("description", "Various bodyweight deadlift modifications");
    record261.set("formTips", "Full range of motion, controlled descent");
    record261.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record261);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record262 = new Record(collection);
    record262.set("name", "Resistance Band Deadlift Variations");
    record262.set("equipment", "Bands");
    record262.set("muscleGroup", "Legs");
    record262.set("description", "Various band deadlift modifications");
    record262.set("formTips", "Full range of motion, constant tension");
    record262.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record262);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record263 = new Record(collection);
    record263.set("name", "Barbell Curl Variations");
    record263.set("equipment", "Barbell");
    record263.set("muscleGroup", "Arms");
    record263.set("description", "Various barbell curl modifications");
    record263.set("formTips", "Full range of motion, controlled tempo");
    record263.set("recommendedSetsReps", "3 sets x 6-10 reps");
  try {
    app.save(record263);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record264 = new Record(collection);
    record264.set("name", "Dumbbell Curl Variations");
    record264.set("equipment", "Dumbbell");
    record264.set("muscleGroup", "Arms");
    record264.set("description", "Various dumbbell curl modifications");
    record264.set("formTips", "Full range of motion, controlled descent");
    record264.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record264);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record265 = new Record(collection);
    record265.set("name", "Machine Curl Variations");
    record265.set("equipment", "Machine");
    record265.set("muscleGroup", "Arms");
    record265.set("description", "Various machine curl modifications");
    record265.set("formTips", "Full range of motion, controlled tempo");
    record265.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record265);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record266 = new Record(collection);
    record266.set("name", "Cable Curl Variations");
    record266.set("equipment", "Cable");
    record266.set("muscleGroup", "Arms");
    record266.set("description", "Various cable curl modifications");
    record266.set("formTips", "Full range of motion, constant tension");
    record266.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record266);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record267 = new Record(collection);
    record267.set("name", "Resistance Band Curl Variations");
    record267.set("equipment", "Bands");
    record267.set("muscleGroup", "Arms");
    record267.set("description", "Various band curl modifications");
    record267.set("formTips", "Full range of motion, constant tension");
    record267.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record267);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record268 = new Record(collection);
    record268.set("name", "Barbell Tricep Extension Variations");
    record268.set("equipment", "Barbell");
    record268.set("muscleGroup", "Arms");
    record268.set("description", "Various barbell tricep modifications");
    record268.set("formTips", "Full range of motion, controlled tempo");
    record268.set("recommendedSetsReps", "3 sets x 6-10 reps");
  try {
    app.save(record268);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record269 = new Record(collection);
    record269.set("name", "Dumbbell Tricep Extension Variations");
    record269.set("equipment", "Dumbbell");
    record269.set("muscleGroup", "Arms");
    record269.set("description", "Various dumbbell tricep modifications");
    record269.set("formTips", "Full range of motion, controlled descent");
    record269.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record269);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record270 = new Record(collection);
    record270.set("name", "Machine Tricep Extension Variations");
    record270.set("equipment", "Machine");
    record270.set("muscleGroup", "Arms");
    record270.set("description", "Various machine tricep modifications");
    record270.set("formTips", "Full range of motion, controlled tempo");
    record270.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record270);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record271 = new Record(collection);
    record271.set("name", "Cable Tricep Extension Variations");
    record271.set("equipment", "Cable");
    record271.set("muscleGroup", "Arms");
    record271.set("description", "Various cable tricep modifications");
    record271.set("formTips", "Full range of motion, constant tension");
    record271.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record271);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record272 = new Record(collection);
    record272.set("name", "Resistance Band Tricep Extension Variations");
    record272.set("equipment", "Bands");
    record272.set("muscleGroup", "Arms");
    record272.set("description", "Various band tricep modifications");
    record272.set("formTips", "Full range of motion, constant tension");
    record272.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record272);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record273 = new Record(collection);
    record273.set("name", "Barbell Shoulder Press Variations");
    record273.set("equipment", "Barbell");
    record273.set("muscleGroup", "Shoulders");
    record273.set("description", "Various barbell shoulder press modifications");
    record273.set("formTips", "Full range of motion, controlled tempo");
    record273.set("recommendedSetsReps", "3 sets x 6-10 reps");
  try {
    app.save(record273);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record274 = new Record(collection);
    record274.set("name", "Dumbbell Shoulder Press Variations");
    record274.set("equipment", "Dumbbell");
    record274.set("muscleGroup", "Shoulders");
    record274.set("description", "Various dumbbell shoulder press modifications");
    record274.set("formTips", "Full range of motion, controlled descent");
    record274.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record274);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record275 = new Record(collection);
    record275.set("name", "Machine Shoulder Press Variations");
    record275.set("equipment", "Machine");
    record275.set("muscleGroup", "Shoulders");
    record275.set("description", "Various machine shoulder press modifications");
    record275.set("formTips", "Full range of motion, controlled tempo");
    record275.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record275);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record276 = new Record(collection);
    record276.set("name", "Cable Shoulder Press Variations");
    record276.set("equipment", "Cable");
    record276.set("muscleGroup", "Shoulders");
    record276.set("description", "Various cable shoulder press modifications");
    record276.set("formTips", "Full range of motion, constant tension");
    record276.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record276);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record277 = new Record(collection);
    record277.set("name", "Resistance Band Shoulder Press Variations");
    record277.set("equipment", "Bands");
    record277.set("muscleGroup", "Shoulders");
    record277.set("description", "Various band shoulder press modifications");
    record277.set("formTips", "Full range of motion, constant tension");
    record277.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record277);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record278 = new Record(collection);
    record278.set("name", "Barbell Lateral Raise Variations");
    record278.set("equipment", "Barbell");
    record278.set("muscleGroup", "Shoulders");
    record278.set("description", "Various barbell lateral raise modifications");
    record278.set("formTips", "Full range of motion, controlled tempo");
    record278.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record278);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record279 = new Record(collection);
    record279.set("name", "Dumbbell Lateral Raise Variations");
    record279.set("equipment", "Dumbbell");
    record279.set("muscleGroup", "Shoulders");
    record279.set("description", "Various dumbbell lateral raise modifications");
    record279.set("formTips", "Full range of motion, controlled descent");
    record279.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record279);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record280 = new Record(collection);
    record280.set("name", "Machine Lateral Raise Variations");
    record280.set("equipment", "Machine");
    record280.set("muscleGroup", "Shoulders");
    record280.set("description", "Various machine lateral raise modifications");
    record280.set("formTips", "Full range of motion, controlled tempo");
    record280.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record280);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record281 = new Record(collection);
    record281.set("name", "Cable Lateral Raise Variations");
    record281.set("equipment", "Cable");
    record281.set("muscleGroup", "Shoulders");
    record281.set("description", "Various cable lateral raise modifications");
    record281.set("formTips", "Full range of motion, constant tension");
    record281.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record281);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record282 = new Record(collection);
    record282.set("name", "Resistance Band Lateral Raise Variations");
    record282.set("equipment", "Bands");
    record282.set("muscleGroup", "Shoulders");
    record282.set("description", "Various band lateral raise modifications");
    record282.set("formTips", "Full range of motion, constant tension");
    record282.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record282);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record283 = new Record(collection);
    record283.set("name", "Barbell Front Raise Variations");
    record283.set("equipment", "Barbell");
    record283.set("muscleGroup", "Shoulders");
    record283.set("description", "Various barbell front raise modifications");
    record283.set("formTips", "Full range of motion, controlled tempo");
    record283.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record283);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record284 = new Record(collection);
    record284.set("name", "Dumbbell Front Raise Variations");
    record284.set("equipment", "Dumbbell");
    record284.set("muscleGroup", "Shoulders");
    record284.set("description", "Various dumbbell front raise modifications");
    record284.set("formTips", "Full range of motion, controlled descent");
    record284.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record284);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record285 = new Record(collection);
    record285.set("name", "Machine Front Raise Variations");
    record285.set("equipment", "Machine");
    record285.set("muscleGroup", "Shoulders");
    record285.set("description", "Various machine front raise modifications");
    record285.set("formTips", "Full range of motion, controlled tempo");
    record285.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record285);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record286 = new Record(collection);
    record286.set("name", "Cable Front Raise Variations");
    record286.set("equipment", "Cable");
    record286.set("muscleGroup", "Shoulders");
    record286.set("description", "Various cable front raise modifications");
    record286.set("formTips", "Full range of motion, constant tension");
    record286.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record286);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record287 = new Record(collection);
    record287.set("name", "Resistance Band Front Raise Variations");
    record287.set("equipment", "Bands");
    record287.set("muscleGroup", "Shoulders");
    record287.set("description", "Various band front raise modifications");
    record287.set("formTips", "Full range of motion, constant tension");
    record287.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record287);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record288 = new Record(collection);
    record288.set("name", "Barbell Shrug Variations");
    record288.set("equipment", "Barbell");
    record288.set("muscleGroup", "Shoulders");
    record288.set("description", "Various barbell shrug modifications");
    record288.set("formTips", "Full range of motion, squeeze at top");
    record288.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record288);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record289 = new Record(collection);
    record289.set("name", "Dumbbell Shrug Variations");
    record289.set("equipment", "Dumbbell");
    record289.set("muscleGroup", "Shoulders");
    record289.set("description", "Various dumbbell shrug modifications");
    record289.set("formTips", "Full range of motion, squeeze at top");
    record289.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record289);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record290 = new Record(collection);
    record290.set("name", "Machine Shrug Variations");
    record290.set("equipment", "Machine");
    record290.set("muscleGroup", "Shoulders");
    record290.set("description", "Various machine shrug modifications");
    record290.set("formTips", "Full range of motion, squeeze at top");
    record290.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record290);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record291 = new Record(collection);
    record291.set("name", "Cable Shrug Variations");
    record291.set("equipment", "Cable");
    record291.set("muscleGroup", "Shoulders");
    record291.set("description", "Various cable shrug modifications");
    record291.set("formTips", "Full range of motion, squeeze at top");
    record291.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record291);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record292 = new Record(collection);
    record292.set("name", "Resistance Band Shrug Variations");
    record292.set("equipment", "Bands");
    record292.set("muscleGroup", "Shoulders");
    record292.set("description", "Various band shrug modifications");
    record292.set("formTips", "Full range of motion, squeeze at top");
    record292.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record292);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record293 = new Record(collection);
    record293.set("name", "Barbell Upright Row Variations");
    record293.set("equipment", "Barbell");
    record293.set("muscleGroup", "Shoulders");
    record293.set("description", "Various barbell upright row modifications");
    record293.set("formTips", "Full range of motion, elbows high");
    record293.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record293);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record294 = new Record(collection);
    record294.set("name", "Dumbbell Upright Row Variations");
    record294.set("equipment", "Dumbbell");
    record294.set("muscleGroup", "Shoulders");
    record294.set("description", "Various dumbbell upright row modifications");
    record294.set("formTips", "Full range of motion, elbows high");
    record294.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record294);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record295 = new Record(collection);
    record295.set("name", "Machine Upright Row Variations");
    record295.set("equipment", "Machine");
    record295.set("muscleGroup", "Shoulders");
    record295.set("description", "Various machine upright row modifications");
    record295.set("formTips", "Full range of motion, elbows high");
    record295.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record295);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record296 = new Record(collection);
    record296.set("name", "Cable Upright Row Variations");
    record296.set("equipment", "Cable");
    record296.set("muscleGroup", "Shoulders");
    record296.set("description", "Various cable upright row modifications");
    record296.set("formTips", "Full range of motion, elbows high");
    record296.set("recommendedSetsReps", "3 sets x 10-12 reps");
  try {
    app.save(record296);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record297 = new Record(collection);
    record297.set("name", "Resistance Band Upright Row Variations");
    record297.set("equipment", "Bands");
    record297.set("muscleGroup", "Shoulders");
    record297.set("description", "Various band upright row modifications");
    record297.set("formTips", "Full range of motion, elbows high");
    record297.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record297);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record298 = new Record(collection);
    record298.set("name", "Barbell Reverse Fly Variations");
    record298.set("equipment", "Barbell");
    record298.set("muscleGroup", "Shoulders");
    record298.set("description", "Various barbell reverse fly modifications");
    record298.set("formTips", "Full range of motion, squeeze at peak");
    record298.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record298);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record299 = new Record(collection);
    record299.set("name", "Dumbbell Reverse Fly Variations");
    record299.set("equipment", "Dumbbell");
    record299.set("muscleGroup", "Shoulders");
    record299.set("description", "Various dumbbell reverse fly modifications");
    record299.set("formTips", "Full range of motion, squeeze at peak");
    record299.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record299);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record300 = new Record(collection);
    record300.set("name", "Machine Reverse Fly Variations");
    record300.set("equipment", "Machine");
    record300.set("muscleGroup", "Shoulders");
    record300.set("description", "Various machine reverse fly modifications");
    record300.set("formTips", "Full range of motion, squeeze at peak");
    record300.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record300);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record301 = new Record(collection);
    record301.set("name", "Cable Reverse Fly Variations");
    record301.set("equipment", "Cable");
    record301.set("muscleGroup", "Shoulders");
    record301.set("description", "Various cable reverse fly modifications");
    record301.set("formTips", "Full range of motion, squeeze at peak");
    record301.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record301);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record302 = new Record(collection);
    record302.set("name", "Resistance Band Reverse Fly Variations");
    record302.set("equipment", "Bands");
    record302.set("muscleGroup", "Shoulders");
    record302.set("description", "Various band reverse fly modifications");
    record302.set("formTips", "Full range of motion, squeeze at peak");
    record302.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record302);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record303 = new Record(collection);
    record303.set("name", "Barbell Crunch Variations");
    record303.set("equipment", "Barbell");
    record303.set("muscleGroup", "Abs-Core");
    record303.set("description", "Various barbell crunch modifications");
    record303.set("formTips", "Full range of motion, squeeze at top");
    record303.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record303);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record304 = new Record(collection);
    record304.set("name", "Dumbbell Crunch Variations");
    record304.set("equipment", "Dumbbell");
    record304.set("muscleGroup", "Abs-Core");
    record304.set("description", "Various dumbbell crunch modifications");
    record304.set("formTips", "Full range of motion, squeeze at top");
    record304.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record304);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record305 = new Record(collection);
    record305.set("name", "Machine Crunch Variations");
    record305.set("equipment", "Machine");
    record305.set("muscleGroup", "Abs-Core");
    record305.set("description", "Various machine crunch modifications");
    record305.set("formTips", "Full range of motion, squeeze at top");
    record305.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record305);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record306 = new Record(collection);
    record306.set("name", "Cable Crunch Variations");
    record306.set("equipment", "Cable");
    record306.set("muscleGroup", "Abs-Core");
    record306.set("description", "Various cable crunch modifications");
    record306.set("formTips", "Full range of motion, squeeze at top");
    record306.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record306);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record307 = new Record(collection);
    record307.set("name", "Resistance Band Crunch Variations");
    record307.set("equipment", "Bands");
    record307.set("muscleGroup", "Abs-Core");
    record307.set("description", "Various band crunch modifications");
    record307.set("formTips", "Full range of motion, squeeze at top");
    record307.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record307);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record308 = new Record(collection);
    record308.set("name", "Barbell Leg Raise Variations");
    record308.set("equipment", "Barbell");
    record308.set("muscleGroup", "Abs-Core");
    record308.set("description", "Various barbell leg raise modifications");
    record308.set("formTips", "Full range of motion, controlled movement");
    record308.set("recommendedSetsReps", "3 sets x 8-12 reps");
  try {
    app.save(record308);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record309 = new Record(collection);
    record309.set("name", "Dumbbell Leg Raise Variations");
    record309.set("equipment", "Dumbbell");
    record309.set("muscleGroup", "Abs-Core");
    record309.set("description", "Various dumbbell leg raise modifications");
    record309.set("formTips", "Full range of motion, controlled movement");
    record309.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record309);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record310 = new Record(collection);
    record310.set("name", "Machine Leg Raise Variations");
    record310.set("equipment", "Machine");
    record310.set("muscleGroup", "Abs-Core");
    record310.set("description", "Various machine leg raise modifications");
    record310.set("formTips", "Full range of motion, controlled tempo");
    record310.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record310);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record311 = new Record(collection);
    record311.set("name", "Cable Leg Raise Variations");
    record311.set("equipment", "Cable");
    record311.set("muscleGroup", "Abs-Core");
    record311.set("description", "Various cable leg raise modifications");
    record311.set("formTips", "Full range of motion, controlled movement");
    record311.set("recommendedSetsReps", "3 sets x 10-15 reps");
  try {
    app.save(record311);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record312 = new Record(collection);
    record312.set("name", "Resistance Band Leg Raise Variations");
    record312.set("equipment", "Bands");
    record312.set("muscleGroup", "Abs-Core");
    record312.set("description", "Various band leg raise modifications");
    record312.set("formTips", "Full range of motion, controlled movement");
    record312.set("recommendedSetsReps", "3 sets x 12-15 reps");
  try {
    app.save(record312);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record313 = new Record(collection);
    record313.set("name", "Barbell Plank Variations");
    record313.set("equipment", "Barbell");
    record313.set("muscleGroup", "Abs-Core");
    record313.set("description", "Various barbell plank modifications");
    record313.set("formTips", "Straight body line, engage core");
    record313.set("recommendedSetsReps", "3 sets x 30-60 seconds");
  try {
    app.save(record313);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record314 = new Record(collection);
    record314.set("name", "Dumbbell Plank Variations");
    record314.set("equipment", "Dumbbell");
    record314.set("muscleGroup", "Abs-Core");
    record314.set("description", "Various dumbbell plank modifications");
    record314.set("formTips", "Straight body line, engage core");
    record314.set("recommendedSetsReps", "3 sets x 30-60 seconds");
  try {
    app.save(record314);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record315 = new Record(collection);
    record315.set("name", "Machine Plank Variations");
    record315.set("equipment", "Machine");
    record315.set("muscleGroup", "Abs-Core");
    record315.set("description", "Various machine plank modifications");
    record315.set("formTips", "Straight body line, engage core");
    record315.set("recommendedSetsReps", "3 sets x 30-60 seconds");
  try {
    app.save(record315);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record316 = new Record(collection);
    record316.set("name", "Cable Plank Variations");
    record316.set("equipment", "Cable");
    record316.set("muscleGroup", "Abs-Core");
    record316.set("description", "Various cable plank modifications");
    record316.set("formTips", "Straight body line, engage core");
    record316.set("recommendedSetsReps", "3 sets x 30-60 seconds");
  try {
    app.save(record316);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record317 = new Record(collection);
    record317.set("name", "Resistance Band Plank Variations");
    record317.set("equipment", "Bands");
    record317.set("muscleGroup", "Abs-Core");
    record317.set("description", "Various band plank modifications");
    record317.set("formTips", "Straight body line, engage core");
    record317.set("recommendedSetsReps", "3 sets x 30-60 seconds");
  try {
    app.save(record317);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record318 = new Record(collection);
    record318.set("name", "Barbell Russian Twist Variations");
    record318.set("equipment", "Barbell");
    record318.set("muscleGroup", "Abs-Core");
    record318.set("description", "Various barbell Russian twist modifications");
    record318.set("formTips", "Controlled rotation, full range of motion");
    record318.set("recommendedSetsReps", "3 sets x 12-15 reps per side");
  try {
    app.save(record318);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record319 = new Record(collection);
    record319.set("name", "Dumbbell Russian Twist Variations");
    record319.set("equipment", "Dumbbell");
    record319.set("muscleGroup", "Abs-Core");
    record319.set("description", "Various dumbbell Russian twist modifications");
    record319.set("formTips", "Controlled rotation, full range of motion");
    record319.set("recommendedSetsReps", "3 sets x 12-15 reps per side");
  try {
    app.save(record319);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record320 = new Record(collection);
    record320.set("name", "Machine Russian Twist Variations");
    record320.set("equipment", "Machine");
    record320.set("muscleGroup", "Abs-Core");
    record320.set("description", "Various machine Russian twist modifications");
    record320.set("formTips", "Controlled rotation, full range of motion");
    record320.set("recommendedSetsReps", "3 sets x 12-15 reps per side");
  try {
    app.save(record320);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record321 = new Record(collection);
    record321.set("name", "Cable Russian Twist Variations");
    record321.set("equipment", "Cable");
    record321.set("muscleGroup", "Abs-Core");
    record321.set("description", "Various cable Russian twist modifications");
    record321.set("formTips", "Controlled rotation, full range of motion");
    record321.set("recommendedSetsReps", "3 sets x 12-15 reps per side");
  try {
    app.save(record321);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record322 = new Record(collection);
    record322.set("name", "Resistance Band Russian Twist Variations");
    record322.set("equipment", "Bands");
    record322.set("muscleGroup", "Abs-Core");
    record322.set("description", "Various band Russian twist modifications");
    record322.set("formTips", "Controlled rotation, full range of motion");
    record322.set("recommendedSetsReps", "3 sets x 12-15 reps per side");
  try {
    app.save(record322);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record323 = new Record(collection);
    record323.set("name", "Barbell Woodchop Variations");
    record323.set("equipment", "Barbell");
    record323.set("muscleGroup", "Abs-Core");
    record323.set("description", "Various barbell woodchop modifications");
    record323.set("formTips", "Controlled rotation, full range of motion");
    record323.set("recommendedSetsReps", "3 sets x 10-12 reps per side");
  try {
    app.save(record323);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record324 = new Record(collection);
    record324.set("name", "Dumbbell Woodchop Variations");
    record324.set("equipment", "Dumbbell");
    record324.set("muscleGroup", "Abs-Core");
    record324.set("description", "Various dumbbell woodchop modifications");
    record324.set("formTips", "Controlled rotation, full range of motion");
    record324.set("recommendedSetsReps", "3 sets x 10-12 reps per side");
  try {
    app.save(record324);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record325 = new Record(collection);
    record325.set("name", "Machine Woodchop Variations");
    record325.set("equipment", "Machine");
    record325.set("muscleGroup", "Abs-Core");
    record325.set("description", "Various machine woodchop modifications");
    record325.set("formTips", "Controlled rotation, full range of motion");
    record325.set("recommendedSetsReps", "3 sets x 10-12 reps per side");
  try {
    app.save(record325);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record326 = new Record(collection);
    record326.set("name", "Cable Woodchop Variations");
    record326.set("equipment", "Cable");
    record326.set("muscleGroup", "Abs-Core");
    record326.set("description", "Various cable woodchop modifications");
    record326.set("formTips", "Controlled rotation, full range of motion");
    record326.set("recommendedSetsReps", "3 sets x 10-12 reps per side");
  try {
    app.save(record326);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record327 = new Record(collection);
    record327.set("name", "Resistance Band Woodchop Variations");
    record327.set("equipment", "Bands");
    record327.set("muscleGroup", "Abs-Core");
    record327.set("description", "Various band woodchop modifications");
    record327.set("formTips", "Controlled rotation, full range of motion");
    record327.set("recommendedSetsReps", "3 sets x 10-12 reps per side");
  try {
    app.save(record327);
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
