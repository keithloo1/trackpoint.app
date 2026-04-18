/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("exercises");

  const record0 = new Record(collection);
    record0.set("name", "Push-ups - Standard - Bodyweight - Chest Focus");
    record0.set("equipment", "Bodyweight");
    record0.set("muscleGroup", "Chest");
    record0.set("description", "Standard push-up with hands shoulder-width apart, body in straight line from head to heels");
    record0.set("formTips", "Keep core tight, elbows at 45 degrees, lower chest to 1-2 inches from ground, maintain neutral spine");
    record0.set("recommendedSetsReps", "3 sets x 8-12 reps");
    record0.set("videoUrl", "https://example.com/pushup-standard");
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
    record1.set("name", "Push-ups - Wide Grip - Bodyweight - Chest Focus");
    record1.set("equipment", "Bodyweight");
    record1.set("muscleGroup", "Chest");
    record1.set("description", "Push-up with hands wider than shoulder-width to emphasize chest");
    record1.set("formTips", "Hands 1.5x shoulder width, keep elbows flared, lower chest to ground");
    record1.set("recommendedSetsReps", "3 sets x 8-12 reps");
    record1.set("videoUrl", "https://example.com/pushup-wide");
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
    record2.set("name", "Push-ups - Close Grip - Bodyweight - Triceps Focus");
    record2.set("equipment", "Bodyweight");
    record2.set("muscleGroup", "Arms");
    record2.set("description", "Push-up with hands close together to emphasize triceps");
    record2.set("formTips", "Hands 6-12 inches apart, elbows tucked to body, lower chest to ground");
    record2.set("recommendedSetsReps", "3 sets x 8-12 reps");
    record2.set("videoUrl", "https://example.com/pushup-close");
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
    record3.set("name", "Push-ups - Diamond - Bodyweight - Triceps Focus");
    record3.set("equipment", "Bodyweight");
    record3.set("muscleGroup", "Arms");
    record3.set("description", "Push-up with hands forming diamond shape for maximum triceps activation");
    record3.set("formTips", "Thumbs and index fingers form diamond, elbows tucked, lower chest to hands");
    record3.set("recommendedSetsReps", "3 sets x 6-10 reps");
    record3.set("videoUrl", "https://example.com/pushup-diamond");
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
    record4.set("name", "Push-ups - Decline - Bodyweight - Shoulders Focus");
    record4.set("equipment", "Bodyweight");
    record4.set("muscleGroup", "Shoulders");
    record4.set("description", "Push-up with feet elevated on bench or step");
    record4.set("formTips", "Feet 12-24 inches elevated, maintain straight body line, lower chest to ground");
    record4.set("recommendedSetsReps", "3 sets x 8-12 reps");
    record4.set("videoUrl", "https://example.com/pushup-decline");
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
    record5.set("name", "Push-ups - Incline - Bodyweight - Chest Focus");
    record5.set("equipment", "Bodyweight");
    record5.set("muscleGroup", "Chest");
    record5.set("description", "Push-up with hands elevated on bench or step");
    record5.set("formTips", "Hands on elevated surface, maintain straight body line, lower chest to hands");
    record5.set("recommendedSetsReps", "3 sets x 10-15 reps");
    record5.set("videoUrl", "https://example.com/pushup-incline");
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
    record6.set("name", "Push-ups - Archer - Bodyweight - Chest Focus");
    record6.set("equipment", "Bodyweight");
    record6.set("muscleGroup", "Chest");
    record6.set("description", "Push-up with one arm extended, shifting weight side to side");
    record6.set("formTips", "One arm wide, one arm bent, shift weight, alternate sides");
    record6.set("recommendedSetsReps", "3 sets x 6-10 reps per side");
    record6.set("videoUrl", "https://example.com/pushup-archer");
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
    record7.set("name", "Push-ups - Pseudo Planche - Bodyweight - Chest Focus");
    record7.set("equipment", "Bodyweight");
    record7.set("muscleGroup", "Chest");
    record7.set("description", "Push-up with hands positioned near hips for increased difficulty");
    record7.set("formTips", "Hands near hips, lean forward, maintain straight body line");
    record7.set("recommendedSetsReps", "3 sets x 5-8 reps");
    record7.set("videoUrl", "https://example.com/pushup-planche");
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
    record8.set("name", "Dumbbell Bench Press - Flat - Dumbbell - Chest Focus");
    record8.set("equipment", "Dumbbell");
    record8.set("muscleGroup", "Chest");
    record8.set("description", "Pressing dumbbells on flat bench with neutral grip");
    record8.set("formTips", "Feet flat on floor, dumbbells at chest level, press up and slightly together");
    record8.set("recommendedSetsReps", "4 sets x 6-10 reps");
    record8.set("videoUrl", "https://example.com/db-bench-flat");
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
    record9.set("name", "Dumbbell Bench Press - Incline - Dumbbell - Chest Focus");
    record9.set("equipment", "Dumbbell");
    record9.set("muscleGroup", "Chest");
    record9.set("description", "Pressing dumbbells on incline bench to emphasize upper chest");
    record9.set("formTips", "Bench at 30-45 degrees, dumbbells at shoulder level, press up");
    record9.set("recommendedSetsReps", "4 sets x 6-10 reps");
    record9.set("videoUrl", "https://example.com/db-bench-incline");
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
    record10.set("name", "Dumbbell Bench Press - Decline - Dumbbell - Chest Focus");
    record10.set("equipment", "Dumbbell");
    record10.set("muscleGroup", "Chest");
    record10.set("description", "Pressing dumbbells on decline bench to emphasize lower chest");
    record10.set("formTips", "Bench declined 15-30 degrees, dumbbells at chest level, press up");
    record10.set("recommendedSetsReps", "4 sets x 6-10 reps");
    record10.set("videoUrl", "https://example.com/db-bench-decline");
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
    record11.set("name", "Dumbbell Flyes - Flat - Dumbbell - Chest Focus");
    record11.set("equipment", "Dumbbell");
    record11.set("muscleGroup", "Chest");
    record11.set("description", "Dumbbell flyes on flat bench with arc motion");
    record11.set("formTips", "Slight bend in elbows, dumbbells in arc motion, chest squeeze at top");
    record11.set("recommendedSetsReps", "3 sets x 10-12 reps");
    record11.set("videoUrl", "https://example.com/db-flyes-flat");
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
    record12.set("name", "Dumbbell Flyes - Incline - Dumbbell - Chest Focus");
    record12.set("equipment", "Dumbbell");
    record12.set("muscleGroup", "Chest");
    record12.set("description", "Dumbbell flyes on incline bench");
    record12.set("formTips", "Bench at 30-45 degrees, arc motion, chest squeeze");
    record12.set("recommendedSetsReps", "3 sets x 10-12 reps");
    record12.set("videoUrl", "https://example.com/db-flyes-incline");
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
    record13.set("name", "Dumbbell Flyes - Decline - Dumbbell - Chest Focus");
    record13.set("equipment", "Dumbbell");
    record13.set("muscleGroup", "Chest");
    record13.set("description", "Dumbbell flyes on decline bench");
    record13.set("formTips", "Bench declined, arc motion, lower chest emphasis");
    record13.set("recommendedSetsReps", "3 sets x 10-12 reps");
    record13.set("videoUrl", "https://example.com/db-flyes-decline");
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
    record14.set("name", "Dumbbell Rows - Single Arm - Dumbbell - Back Focus");
    record14.set("equipment", "Dumbbell");
    record14.set("muscleGroup", "Back");
    record14.set("description", "Single arm dumbbell row with knee on bench");
    record14.set("formTips", "Knee on bench, row dumbbell to hip, squeeze shoulder blade");
    record14.set("recommendedSetsReps", "4 sets x 8-12 reps per side");
    record14.set("videoUrl", "https://example.com/db-row-single");
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
    record15.set("name", "Dumbbell Rows - Double Arm - Dumbbell - Back Focus");
    record15.set("equipment", "Dumbbell");
    record15.set("muscleGroup", "Back");
    record15.set("description", "Double arm dumbbell rows in bent over position");
    record15.set("formTips", "Hinge at hips, row dumbbells to sides, squeeze back");
    record15.set("recommendedSetsReps", "4 sets x 8-12 reps");
    record15.set("videoUrl", "https://example.com/db-row-double");
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
    record16.set("name", "Dumbbell Rows - Seal Rows - Dumbbell - Back Focus");
    record16.set("equipment", "Dumbbell");
    record16.set("muscleGroup", "Back");
    record16.set("description", "Dumbbell rows on incline bench to eliminate leg drive");
    record16.set("formTips", "Chest on incline bench, row dumbbells, pure back contraction");
    record16.set("recommendedSetsReps", "3 sets x 10-12 reps");
    record16.set("videoUrl", "https://example.com/db-row-seal");
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
    record17.set("name", "Dumbbell Shoulder Press - Standing - Dumbbell - Shoulders Focus");
    record17.set("equipment", "Dumbbell");
    record17.set("muscleGroup", "Shoulders");
    record17.set("description", "Standing dumbbell shoulder press with neutral grip");
    record17.set("formTips", "Feet shoulder-width apart, dumbbells at shoulder level, press overhead");
    record17.set("recommendedSetsReps", "4 sets x 6-10 reps");
    record17.set("videoUrl", "https://example.com/db-press-standing");
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
    record18.set("name", "Dumbbell Shoulder Press - Seated - Dumbbell - Shoulders Focus");
    record18.set("equipment", "Dumbbell");
    record18.set("muscleGroup", "Shoulders");
    record18.set("description", "Seated dumbbell shoulder press with back support");
    record18.set("formTips", "Back against bench, dumbbells at shoulder level, press overhead");
    record18.set("recommendedSetsReps", "4 sets x 6-10 reps");
    record18.set("videoUrl", "https://example.com/db-press-seated");
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
    record19.set("name", "Dumbbell Lateral Raises - Standing - Dumbbell - Shoulders Focus");
    record19.set("equipment", "Dumbbell");
    record19.set("muscleGroup", "Shoulders");
    record19.set("description", "Standing lateral raises for side deltoid isolation");
    record19.set("formTips", "Slight bend in elbows, raise dumbbells to shoulder height, control descent");
    record19.set("recommendedSetsReps", "3 sets x 12-15 reps");
    record19.set("videoUrl", "https://example.com/db-lateral-raise");
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
    record20.set("name", "Dumbbell Front Raises - Standing - Dumbbell - Shoulders Focus");
    record20.set("equipment", "Dumbbell");
    record20.set("muscleGroup", "Shoulders");
    record20.set("description", "Standing front raises for front deltoid isolation");
    record20.set("formTips", "Slight bend in elbows, raise dumbbells to eye level, control descent");
    record20.set("recommendedSetsReps", "3 sets x 12-15 reps");
    record20.set("videoUrl", "https://example.com/db-front-raise");
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
    record21.set("name", "Dumbbell Reverse Flyes - Standing - Dumbbell - Shoulders Focus");
    record21.set("equipment", "Dumbbell");
    record21.set("muscleGroup", "Shoulders");
    record21.set("description", "Standing reverse flyes for rear deltoid isolation");
    record21.set("formTips", "Slight bend in elbows, raise dumbbells out to sides, squeeze rear delts");
    record21.set("recommendedSetsReps", "3 sets x 12-15 reps");
    record21.set("videoUrl", "https://example.com/db-reverse-flye");
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
    record22.set("name", "Dumbbell Curls - Standing - Dumbbell - Arms Focus");
    record22.set("equipment", "Dumbbell");
    record22.set("muscleGroup", "Arms");
    record22.set("description", "Standing dumbbell bicep curls with neutral grip");
    record22.set("formTips", "Elbows at sides, curl dumbbells to shoulders, control descent");
    record22.set("recommendedSetsReps", "3 sets x 8-12 reps");
    record22.set("videoUrl", "https://example.com/db-curl-standing");
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
    record23.set("name", "Dumbbell Curls - Seated - Dumbbell - Arms Focus");
    record23.set("equipment", "Dumbbell");
    record23.set("muscleGroup", "Arms");
    record23.set("description", "Seated dumbbell bicep curls with back support");
    record23.set("formTips", "Back against bench, curl dumbbells to shoulders, no momentum");
    record23.set("recommendedSetsReps", "3 sets x 8-12 reps");
    record23.set("videoUrl", "https://example.com/db-curl-seated");
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
    record24.set("name", "Dumbbell Curls - Incline - Dumbbell - Arms Focus");
    record24.set("equipment", "Dumbbell");
    record24.set("muscleGroup", "Arms");
    record24.set("description", "Incline bench dumbbell curls for extended range of motion");
    record24.set("formTips", "Bench at 45 degrees, curl dumbbells, full stretch at bottom");
    record24.set("recommendedSetsReps", "3 sets x 8-12 reps");
    record24.set("videoUrl", "https://example.com/db-curl-incline");
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
    record25.set("name", "Dumbbell Hammer Curls - Standing - Dumbbell - Arms Focus");
    record25.set("equipment", "Dumbbell");
    record25.set("muscleGroup", "Arms");
    record25.set("description", "Standing hammer curls with neutral grip for biceps and brachialis");
    record25.set("formTips", "Elbows at sides, curl dumbbells with neutral grip, control descent");
    record25.set("recommendedSetsReps", "3 sets x 8-12 reps");
    record25.set("videoUrl", "https://example.com/db-hammer-curl");
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
    record26.set("name", "Dumbbell Tricep Extensions - Overhead - Dumbbell - Arms Focus");
    record26.set("equipment", "Dumbbell");
    record26.set("muscleGroup", "Arms");
    record26.set("description", "Overhead dumbbell tricep extension with single dumbbell");
    record26.set("formTips", "Hold dumbbell overhead, lower behind head, extend fully");
    record26.set("recommendedSetsReps", "3 sets x 10-12 reps");
    record26.set("videoUrl", "https://example.com/db-tricep-overhead");
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
    record27.set("name", "Dumbbell Tricep Extensions - Lying - Dumbbell - Arms Focus");
    record27.set("equipment", "Dumbbell");
    record27.set("muscleGroup", "Arms");
    record27.set("description", "Lying dumbbell tricep extensions on bench");
    record27.set("formTips", "Lying on bench, dumbbells above chest, lower to forehead");
    record27.set("recommendedSetsReps", "3 sets x 10-12 reps");
    record27.set("videoUrl", "https://example.com/db-tricep-lying");
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
    record28.set("name", "Dumbbell Kickbacks - Standing - Dumbbell - Arms Focus");
    record28.set("equipment", "Dumbbell");
    record28.set("muscleGroup", "Arms");
    record28.set("description", "Standing single arm dumbbell kickbacks for tricep isolation");
    record28.set("formTips", "Hinge at hips, extend dumbbell back, squeeze tricep");
    record28.set("recommendedSetsReps", "3 sets x 12-15 reps per side");
    record28.set("videoUrl", "https://example.com/db-kickback");
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
    record29.set("name", "Barbell Bench Press - Flat - Barbell - Chest Focus");
    record29.set("equipment", "Barbell");
    record29.set("muscleGroup", "Chest");
    record29.set("description", "Classic barbell bench press on flat bench");
    record29.set("formTips", "Feet flat, grip shoulder-width, lower to chest, press up");
    record29.set("recommendedSetsReps", "4 sets x 5-8 reps");
    record29.set("videoUrl", "https://example.com/bb-bench-flat");
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
    record30.set("name", "Barbell Bench Press - Incline - Barbell - Chest Focus");
    record30.set("equipment", "Barbell");
    record30.set("muscleGroup", "Chest");
    record30.set("description", "Barbell bench press on incline bench for upper chest");
    record30.set("formTips", "Bench at 30-45 degrees, grip shoulder-width, lower to upper chest");
    record30.set("recommendedSetsReps", "4 sets x 5-8 reps");
    record30.set("videoUrl", "https://example.com/bb-bench-incline");
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
    record31.set("name", "Barbell Bench Press - Decline - Barbell - Chest Focus");
    record31.set("equipment", "Barbell");
    record31.set("muscleGroup", "Chest");
    record31.set("description", "Barbell bench press on decline bench for lower chest");
    record31.set("formTips", "Bench declined, grip shoulder-width, lower to lower chest");
    record31.set("recommendedSetsReps", "4 sets x 5-8 reps");
    record31.set("videoUrl", "https://example.com/bb-bench-decline");
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
    record32.set("name", "Barbell Bench Press - Close Grip - Barbell - Arms Focus");
    record32.set("equipment", "Barbell");
    record32.set("muscleGroup", "Arms");
    record32.set("description", "Barbell bench press with close grip for tricep emphasis");
    record32.set("formTips", "Grip 6-12 inches apart, elbows tucked, lower to chest");
    record32.set("recommendedSetsReps", "4 sets x 6-10 reps");
    record32.set("videoUrl", "https://example.com/bb-bench-close");
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
    record33.set("name", "Barbell Bench Press - Wide Grip - Barbell - Chest Focus");
    record33.set("equipment", "Barbell");
    record33.set("muscleGroup", "Chest");
    record33.set("description", "Barbell bench press with wide grip for chest emphasis");
    record33.set("formTips", "Grip wider than shoulder-width, elbows flared, lower to chest");
    record33.set("recommendedSetsReps", "4 sets x 5-8 reps");
    record33.set("videoUrl", "https://example.com/bb-bench-wide");
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
    record34.set("name", "Barbell Rows - Bent Over - Barbell - Back Focus");
    record34.set("equipment", "Barbell");
    record34.set("muscleGroup", "Back");
    record34.set("description", "Bent over barbell rows for back thickness");
    record34.set("formTips", "Hinge at hips, grip shoulder-width, row to lower chest");
    record34.set("recommendedSetsReps", "4 sets x 5-8 reps");
    record34.set("videoUrl", "https://example.com/bb-row-bent");
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
    record35.set("name", "Barbell Rows - Pendulum - Barbell - Back Focus");
    record35.set("equipment", "Barbell");
    record35.set("muscleGroup", "Back");
    record35.set("description", "Pendulum barbell rows with chest support");
    record35.set("formTips", "Chest on pad, row barbell to chest, squeeze back");
    record35.set("recommendedSetsReps", "4 sets x 6-10 reps");
    record35.set("videoUrl", "https://example.com/bb-row-pendulum");
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
    record36.set("name", "Barbell Rows - Seal Rows - Barbell - Back Focus");
    record36.set("equipment", "Barbell");
    record36.set("muscleGroup", "Back");
    record36.set("description", "Seal barbell rows on incline bench");
    record36.set("formTips", "Chest on incline bench, row barbell, pure back contraction");
    record36.set("recommendedSetsReps", "3 sets x 8-12 reps");
    record36.set("videoUrl", "https://example.com/bb-row-seal");
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
    record37.set("name", "Barbell Rows - Underhand Grip - Barbell - Back Focus");
    record37.set("equipment", "Barbell");
    record37.set("muscleGroup", "Back");
    record37.set("description", "Bent over barbell rows with underhand grip");
    record37.set("formTips", "Hinge at hips, underhand grip, row to lower chest");
    record37.set("recommendedSetsReps", "4 sets x 6-10 reps");
    record37.set("videoUrl", "https://example.com/bb-row-underhand");
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
    record38.set("name", "Barbell Shoulder Press - Standing - Barbell - Shoulders Focus");
    record38.set("equipment", "Barbell");
    record38.set("muscleGroup", "Shoulders");
    record38.set("description", "Standing barbell shoulder press");
    record38.set("formTips", "Feet shoulder-width apart, grip shoulder-width, press overhead");
    record38.set("recommendedSetsReps", "4 sets x 5-8 reps");
    record38.set("videoUrl", "https://example.com/bb-press-standing");
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
    record39.set("name", "Barbell Shoulder Press - Seated - Barbell - Shoulders Focus");
    record39.set("equipment", "Barbell");
    record39.set("muscleGroup", "Shoulders");
    record39.set("description", "Seated barbell shoulder press with back support");
    record39.set("formTips", "Back against bench, grip shoulder-width, press overhead");
    record39.set("recommendedSetsReps", "4 sets x 5-8 reps");
    record39.set("videoUrl", "https://example.com/bb-press-seated");
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
    record40.set("name", "Barbell Shoulder Press - Behind Neck - Barbell - Shoulders Focus");
    record40.set("equipment", "Barbell");
    record40.set("muscleGroup", "Shoulders");
    record40.set("description", "Barbell shoulder press with bar behind neck");
    record40.set("formTips", "Bar behind neck, press overhead, rear delt emphasis");
    record40.set("recommendedSetsReps", "3 sets x 6-10 reps");
    record40.set("videoUrl", "https://example.com/bb-press-behind");
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
    record41.set("name", "Barbell Curls - Standing - Barbell - Arms Focus");
    record41.set("equipment", "Barbell");
    record41.set("muscleGroup", "Arms");
    record41.set("description", "Standing barbell bicep curls");
    record41.set("formTips", "Elbows at sides, curl barbell to shoulders, control descent");
    record41.set("recommendedSetsReps", "3 sets x 6-10 reps");
    record41.set("videoUrl", "https://example.com/bb-curl-standing");
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
    record42.set("name", "Barbell Curls - Seated - Barbell - Arms Focus");
    record42.set("equipment", "Barbell");
    record42.set("muscleGroup", "Arms");
    record42.set("description", "Seated barbell bicep curls with back support");
    record42.set("formTips", "Back against bench, curl barbell to shoulders, no momentum");
    record42.set("recommendedSetsReps", "3 sets x 6-10 reps");
    record42.set("videoUrl", "https://example.com/bb-curl-seated");
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
    record43.set("name", "Barbell Curls - EZ Bar - Barbell - Arms Focus");
    record43.set("equipment", "Barbell");
    record43.set("muscleGroup", "Arms");
    record43.set("description", "EZ bar curls for reduced wrist strain");
    record43.set("formTips", "Elbows at sides, curl EZ bar to shoulders, neutral grip");
    record43.set("recommendedSetsReps", "3 sets x 8-12 reps");
    record43.set("videoUrl", "https://example.com/bb-curl-ez");
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
    record44.set("name", "Barbell Curls - Reverse Grip - Barbell - Arms Focus");
    record44.set("equipment", "Barbell");
    record44.set("muscleGroup", "Arms");
    record44.set("description", "Barbell curls with reverse grip for brachialis");
    record44.set("formTips", "Elbows at sides, reverse grip, curl barbell to shoulders");
    record44.set("recommendedSetsReps", "3 sets x 8-12 reps");
    record44.set("videoUrl", "https://example.com/bb-curl-reverse");
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
    record45.set("name", "Barbell Tricep Extensions - Lying - Barbell - Arms Focus");
    record45.set("equipment", "Barbell");
    record45.set("muscleGroup", "Arms");
    record45.set("description", "Lying barbell tricep extensions (skull crushers)");
    record45.set("formTips", "Lying on bench, barbell above chest, lower to forehead");
    record45.set("recommendedSetsReps", "3 sets x 8-12 reps");
    record45.set("videoUrl", "https://example.com/bb-tricep-lying");
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
    record46.set("name", "Barbell Tricep Extensions - Overhead - Barbell - Arms Focus");
    record46.set("equipment", "Barbell");
    record46.set("muscleGroup", "Arms");
    record46.set("description", "Overhead barbell tricep extensions");
    record46.set("formTips", "Hold barbell overhead, lower behind head, extend fully");
    record46.set("recommendedSetsReps", "3 sets x 8-12 reps");
    record46.set("videoUrl", "https://example.com/bb-tricep-overhead");
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
    record47.set("name", "Barbell Squats - High Bar - Barbell - Legs Focus");
    record47.set("equipment", "Barbell");
    record47.set("muscleGroup", "Legs");
    record47.set("description", "High bar barbell squats with upright torso");
    record47.set("formTips", "Bar high on traps, feet shoulder-width, squat to parallel");
    record47.set("recommendedSetsReps", "4 sets x 5-8 reps");
    record47.set("videoUrl", "https://example.com/bb-squat-high");
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
    record48.set("name", "Barbell Squats - Low Bar - Barbell - Legs Focus");
    record48.set("equipment", "Barbell");
    record48.set("muscleGroup", "Legs");
    record48.set("description", "Low bar barbell squats with forward lean");
    record48.set("formTips", "Bar low on back, feet shoulder-width, squat to parallel");
    record48.set("recommendedSetsReps", "4 sets x 5-8 reps");
    record48.set("videoUrl", "https://example.com/bb-squat-low");
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
    record49.set("name", "Barbell Squats - Pause - Barbell - Legs Focus");
    record49.set("equipment", "Barbell");
    record49.set("muscleGroup", "Legs");
    record49.set("description", "Barbell squats with pause at bottom");
    record49.set("formTips", "Squat to parallel, pause 2-3 seconds, drive up");
    record49.set("recommendedSetsReps", "3 sets x 5-8 reps");
    record49.set("videoUrl", "https://example.com/bb-squat-pause");
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
    record50.set("name", "Barbell Squats - Front - Barbell - Legs Focus");
    record50.set("equipment", "Barbell");
    record50.set("muscleGroup", "Legs");
    record50.set("description", "Front barbell squats with bar on front delts");
    record50.set("formTips", "Bar on front delts, upright torso, squat to parallel");
    record50.set("recommendedSetsReps", "4 sets x 5-8 reps");
    record50.set("videoUrl", "https://example.com/bb-squat-front");
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
    record51.set("name", "Barbell Deadlifts - Conventional - Barbell - Back Focus");
    record51.set("equipment", "Barbell");
    record51.set("muscleGroup", "Back");
    record51.set("description", "Conventional deadlifts with feet hip-width apart");
    record51.set("formTips", "Feet hip-width, grip shoulder-width, drive through heels");
    record51.set("recommendedSetsReps", "4 sets x 3-5 reps");
    record51.set("videoUrl", "https://example.com/bb-deadlift-conventional");
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
    record52.set("name", "Barbell Deadlifts - Sumo - Barbell - Legs Focus");
    record52.set("equipment", "Barbell");
    record52.set("muscleGroup", "Legs");
    record52.set("description", "Sumo deadlifts with wide stance");
    record52.set("formTips", "Feet wide, toes out, grip inside legs, drive through heels");
    record52.set("recommendedSetsReps", "4 sets x 3-5 reps");
    record52.set("videoUrl", "https://example.com/bb-deadlift-sumo");
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
    record53.set("name", "Barbell Deadlifts - Trap Bar - Barbell - Back Focus");
    record53.set("equipment", "Barbell");
    record53.set("muscleGroup", "Back");
    record53.set("description", "Trap bar deadlifts with neutral grip");
    record53.set("formTips", "Inside trap bar, neutral grip, drive through heels");
    record53.set("recommendedSetsReps", "4 sets x 3-5 reps");
    record53.set("videoUrl", "https://example.com/bb-deadlift-trap");
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
    record54.set("name", "Barbell Deadlifts - Deficit - Barbell - Back Focus");
    record54.set("equipment", "Barbell");
    record54.set("muscleGroup", "Back");
    record54.set("description", "Deficit deadlifts standing on elevated platform");
    record54.set("formTips", "Stand on 2-4 inch platform, conventional stance, increased range");
    record54.set("recommendedSetsReps", "3 sets x 3-5 reps");
    record54.set("videoUrl", "https://example.com/bb-deadlift-deficit");
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
    record55.set("name", "Kettlebell Swings - Two Hand - Kettlebell - Full Body Focus");
    record55.set("equipment", "Kettlebell");
    record55.set("muscleGroup", "Full Body");
    record55.set("description", "Two-handed kettlebell swings for explosive power");
    record55.set("formTips", "Hinge at hips, explosive hip drive, kettlebell to shoulder height");
    record55.set("recommendedSetsReps", "3 sets x 15-20 reps");
    record55.set("videoUrl", "https://example.com/kb-swing-two");
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
    record56.set("name", "Kettlebell Swings - Single Arm - Kettlebell - Full Body Focus");
    record56.set("equipment", "Kettlebell");
    record56.set("muscleGroup", "Full Body");
    record56.set("description", "Single-arm kettlebell swings for unilateral power");
    record56.set("formTips", "Hinge at hips, explosive hip drive, kettlebell to shoulder height");
    record56.set("recommendedSetsReps", "3 sets x 12-15 reps per side");
    record56.set("videoUrl", "https://example.com/kb-swing-single");
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
    record57.set("name", "Kettlebell Turkish Get-ups - Kettlebell - Full Body Focus");
    record57.set("equipment", "Kettlebell");
    record57.set("muscleGroup", "Full Body");
    record57.set("description", "Turkish get-ups for full body strength and mobility");
    record57.set("formTips", "Lying down, press kettlebell up, stand up while holding");
    record57.set("recommendedSetsReps", "3 sets x 5 reps per side");
    record57.set("videoUrl", "https://example.com/kb-tgu");
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
    record58.set("name", "Kettlebell Goblet Squats - Kettlebell - Legs Focus");
    record58.set("equipment", "Kettlebell");
    record58.set("muscleGroup", "Legs");
    record58.set("description", "Goblet squats holding kettlebell at chest");
    record58.set("formTips", "Hold kettlebell at chest, feet shoulder-width, squat to parallel");
    record58.set("recommendedSetsReps", "3 sets x 10-15 reps");
    record58.set("videoUrl", "https://example.com/kb-goblet");
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
    record59.set("name", "Kettlebell Rows - Single Arm - Kettlebell - Back Focus");
    record59.set("equipment", "Kettlebell");
    record59.set("muscleGroup", "Back");
    record59.set("description", "Single-arm kettlebell rows for back strength");
    record59.set("formTips", "Hinge at hips, row kettlebell to hip, squeeze back");
    record59.set("recommendedSetsReps", "3 sets x 10-12 reps per side");
    record59.set("videoUrl", "https://example.com/kb-row-single");
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
    record60.set("name", "Kettlebell Rows - Double Arm - Kettlebell - Back Focus");
    record60.set("equipment", "Kettlebell");
    record60.set("muscleGroup", "Back");
    record60.set("description", "Double-arm kettlebell rows");
    record60.set("formTips", "Hinge at hips, row kettlebells to hips, squeeze back");
    record60.set("recommendedSetsReps", "3 sets x 10-12 reps");
    record60.set("videoUrl", "https://example.com/kb-row-double");
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
    record61.set("name", "Kettlebell Presses - Standing - Kettlebell - Shoulders Focus");
    record61.set("equipment", "Kettlebell");
    record61.set("muscleGroup", "Shoulders");
    record61.set("description", "Standing kettlebell shoulder presses");
    record61.set("formTips", "Kettlebell at shoulder, press overhead, control descent");
    record61.set("recommendedSetsReps", "3 sets x 8-12 reps per side");
    record61.set("videoUrl", "https://example.com/kb-press-standing");
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
    record62.set("name", "Kettlebell Presses - Half Kneeling - Kettlebell - Shoulders Focus");
    record62.set("equipment", "Kettlebell");
    record62.set("muscleGroup", "Shoulders");
    record62.set("description", "Half-kneeling kettlebell presses for core stability");
    record62.set("formTips", "Half-kneeling position, kettlebell at shoulder, press overhead");
    record62.set("recommendedSetsReps", "3 sets x 8-10 reps per side");
    record62.set("videoUrl", "https://example.com/kb-press-half");
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
    record63.set("name", "Resistance Band Chest Press - Standing - Bands - Chest Focus");
    record63.set("equipment", "Bands");
    record63.set("muscleGroup", "Chest");
    record63.set("description", "Standing chest press with resistance bands");
    record63.set("formTips", "Band anchored behind, press forward, control return");
    record63.set("recommendedSetsReps", "3 sets x 12-15 reps");
    record63.set("videoUrl", "https://example.com/band-chest-press");
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
    record64.set("name", "Resistance Band Rows - Standing - Bands - Back Focus");
    record64.set("equipment", "Bands");
    record64.set("muscleGroup", "Back");
    record64.set("description", "Standing rows with resistance bands");
    record64.set("formTips", "Band anchored in front, row toward body, squeeze back");
    record64.set("recommendedSetsReps", "3 sets x 12-15 reps");
    record64.set("videoUrl", "https://example.com/band-row");
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
    record65.set("name", "Resistance Band Shoulder Press - Standing - Bands - Shoulders Focus");
    record65.set("equipment", "Bands");
    record65.set("muscleGroup", "Shoulders");
    record65.set("description", "Standing shoulder press with resistance bands");
    record65.set("formTips", "Band under feet, press overhead, control descent");
    record65.set("recommendedSetsReps", "3 sets x 12-15 reps");
    record65.set("videoUrl", "https://example.com/band-press");
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
    record66.set("name", "Resistance Band Lateral Raises - Standing - Bands - Shoulders Focus");
    record66.set("equipment", "Bands");
    record66.set("muscleGroup", "Shoulders");
    record66.set("description", "Standing lateral raises with resistance bands");
    record66.set("formTips", "Band under feet, raise arms to sides, control descent");
    record66.set("recommendedSetsReps", "3 sets x 15-20 reps");
    record66.set("videoUrl", "https://example.com/band-lateral");
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
    record67.set("name", "Resistance Band Bicep Curls - Standing - Bands - Arms Focus");
    record67.set("equipment", "Bands");
    record67.set("muscleGroup", "Arms");
    record67.set("description", "Standing bicep curls with resistance bands");
    record67.set("formTips", "Band under feet, curl toward shoulders, control descent");
    record67.set("recommendedSetsReps", "3 sets x 12-15 reps");
    record67.set("videoUrl", "https://example.com/band-curl");
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
    record68.set("name", "Resistance Band Tricep Extensions - Overhead - Bands - Arms Focus");
    record68.set("equipment", "Bands");
    record68.set("muscleGroup", "Arms");
    record68.set("description", "Overhead tricep extensions with resistance bands");
    record68.set("formTips", "Band overhead, extend arms, control descent");
    record68.set("recommendedSetsReps", "3 sets x 12-15 reps");
    record68.set("videoUrl", "https://example.com/band-tricep");
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
    record69.set("name", "Resistance Band Squats - Standing - Bands - Legs Focus");
    record69.set("equipment", "Bands");
    record69.set("muscleGroup", "Legs");
    record69.set("description", "Standing squats with resistance bands");
    record69.set("formTips", "Band under feet, squat to parallel, drive through heels");
    record69.set("recommendedSetsReps", "3 sets x 12-15 reps");
    record69.set("videoUrl", "https://example.com/band-squat");
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
    record70.set("name", "Pull-ups - Overhand Grip - Pull-up Bar - Back Focus");
    record70.set("equipment", "Pull-up Bar");
    record70.set("muscleGroup", "Back");
    record70.set("description", "Pull-ups with overhand grip for back width");
    record70.set("formTips", "Grip shoulder-width, pull chin over bar, control descent");
    record70.set("recommendedSetsReps", "3 sets x 5-10 reps");
    record70.set("videoUrl", "https://example.com/pullup-overhand");
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
    record71.set("name", "Pull-ups - Underhand Grip - Pull-up Bar - Back Focus");
    record71.set("equipment", "Pull-up Bar");
    record71.set("muscleGroup", "Back");
    record71.set("description", "Pull-ups with underhand grip (chin-ups) for back thickness");
    record71.set("formTips", "Underhand grip, pull chin over bar, control descent");
    record71.set("recommendedSetsReps", "3 sets x 5-10 reps");
    record71.set("videoUrl", "https://example.com/pullup-underhand");
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
    record72.set("name", "Pull-ups - Neutral Grip - Pull-up Bar - Back Focus");
    record72.set("equipment", "Pull-up Bar");
    record72.set("muscleGroup", "Back");
    record72.set("description", "Pull-ups with neutral grip for balanced back development");
    record72.set("formTips", "Neutral grip, pull chin over bar, control descent");
    record72.set("recommendedSetsReps", "3 sets x 5-10 reps");
    record72.set("videoUrl", "https://example.com/pullup-neutral");
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
    record73.set("name", "Pull-ups - Wide Grip - Pull-up Bar - Back Focus");
    record73.set("equipment", "Pull-up Bar");
    record73.set("muscleGroup", "Back");
    record73.set("description", "Pull-ups with wide grip for lat emphasis");
    record73.set("formTips", "Grip wider than shoulder-width, pull to chest, control descent");
    record73.set("recommendedSetsReps", "3 sets x 5-8 reps");
    record73.set("videoUrl", "https://example.com/pullup-wide");
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
    record74.set("name", "Pull-ups - Archer - Pull-up Bar - Back Focus");
    record74.set("equipment", "Pull-up Bar");
    record74.set("muscleGroup", "Back");
    record74.set("description", "Archer pull-ups with one arm extended");
    record74.set("formTips", "One arm extended, one arm bent, shift weight, alternate");
    record74.set("recommendedSetsReps", "3 sets x 5-8 reps per side");
    record74.set("videoUrl", "https://example.com/pullup-archer");
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
    record75.set("name", "Pull-ups - Pseudo Planche - Pull-up Bar - Back Focus");
    record75.set("equipment", "Pull-up Bar");
    record75.set("muscleGroup", "Back");
    record75.set("description", "Pseudo planche pull-ups with forward lean");
    record75.set("formTips", "Lean forward, pull chin over bar, advanced movement");
    record75.set("recommendedSetsReps", "3 sets x 3-5 reps");
    record75.set("videoUrl", "https://example.com/pullup-planche");
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
    record76.set("name", "Dips - Parallel Bars - Pull-up Bar - Chest Focus");
    record76.set("equipment", "Pull-up Bar");
    record76.set("muscleGroup", "Chest");
    record76.set("description", "Dips on parallel bars with forward lean for chest");
    record76.set("formTips", "Lean forward, lower body, elbows flared, press up");
    record76.set("recommendedSetsReps", "3 sets x 5-10 reps");
    record76.set("videoUrl", "https://example.com/dips-chest");
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
    record77.set("name", "Dips - Parallel Bars - Pull-up Bar - Arms Focus");
    record77.set("equipment", "Pull-up Bar");
    record77.set("muscleGroup", "Arms");
    record77.set("description", "Dips on parallel bars with upright torso for triceps");
    record77.set("formTips", "Upright torso, lower body, elbows tucked, press up");
    record77.set("recommendedSetsReps", "3 sets x 5-10 reps");
    record77.set("videoUrl", "https://example.com/dips-triceps");
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
    record78.set("name", "Dips - Bench - Pull-up Bar - Arms Focus");
    record78.set("equipment", "Pull-up Bar");
    record78.set("muscleGroup", "Arms");
    record78.set("description", "Bench dips for tricep isolation");
    record78.set("formTips", "Hands on bench, feet elevated, lower body, press up");
    record78.set("recommendedSetsReps", "3 sets x 8-12 reps");
    record78.set("videoUrl", "https://example.com/dips-bench");
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
    record79.set("name", "Leg Press - Machine - Machine - Legs Focus");
    record79.set("equipment", "Machine");
    record79.set("muscleGroup", "Legs");
    record79.set("description", "Leg press machine for lower body strength");
    record79.set("formTips", "Feet shoulder-width, lower to 90 degrees, drive through heels");
    record79.set("recommendedSetsReps", "4 sets x 8-12 reps");
    record79.set("videoUrl", "https://example.com/leg-press");
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
    record80.set("name", "Leg Curls - Machine - Machine - Legs Focus");
    record80.set("equipment", "Machine");
    record80.set("muscleGroup", "Legs");
    record80.set("description", "Leg curl machine for hamstring isolation");
    record80.set("formTips", "Lying down, curl legs up, control descent");
    record80.set("recommendedSetsReps", "3 sets x 10-12 reps");
    record80.set("videoUrl", "https://example.com/leg-curl");
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
    record81.set("name", "Leg Extensions - Machine - Machine - Legs Focus");
    record81.set("equipment", "Machine");
    record81.set("muscleGroup", "Legs");
    record81.set("description", "Leg extension machine for quad isolation");
    record81.set("formTips", "Seated, extend legs, control descent");
    record81.set("recommendedSetsReps", "3 sets x 10-12 reps");
    record81.set("videoUrl", "https://example.com/leg-ext");
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
    record82.set("name", "Chest Press - Machine - Machine - Chest Focus");
    record82.set("equipment", "Machine");
    record82.set("muscleGroup", "Chest");
    record82.set("description", "Chest press machine for chest strength");
    record82.set("formTips", "Seated, press handles forward, control return");
    record82.set("recommendedSetsReps", "3 sets x 8-12 reps");
    record82.set("videoUrl", "https://example.com/chest-press-machine");
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
    record83.set("name", "Lat Pulldown - Machine - Machine - Back Focus");
    record83.set("equipment", "Machine");
    record83.set("muscleGroup", "Back");
    record83.set("description", "Lat pulldown machine for back width");
    record83.set("formTips", "Seated, pull bar to chest, control return");
    record83.set("recommendedSetsReps", "3 sets x 8-12 reps");
    record83.set("videoUrl", "https://example.com/lat-pulldown");
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
    record84.set("name", "Cable Chest Flyes - Cable - Cable - Chest Focus");
    record84.set("equipment", "Cable");
    record84.set("muscleGroup", "Chest");
    record84.set("description", "Cable chest flyes for chest isolation");
    record84.set("formTips", "Cables at shoulder height, arc motion, chest squeeze");
    record84.set("recommendedSetsReps", "3 sets x 10-12 reps");
    record84.set("videoUrl", "https://example.com/cable-flyes");
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
    record85.set("name", "Cable Rows - Cable - Cable - Back Focus");
    record85.set("equipment", "Cable");
    record85.set("muscleGroup", "Back");
    record85.set("description", "Cable rows for back strength");
    record85.set("formTips", "Seated, row handle to chest, squeeze back");
    record85.set("recommendedSetsReps", "3 sets x 8-12 reps");
    record85.set("videoUrl", "https://example.com/cable-row");
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
    record86.set("name", "Cable Shoulder Press - Cable - Cable - Shoulders Focus");
    record86.set("equipment", "Cable");
    record86.set("muscleGroup", "Shoulders");
    record86.set("description", "Cable shoulder press for shoulder strength");
    record86.set("formTips", "Standing, press handles overhead, control descent");
    record86.set("recommendedSetsReps", "3 sets x 10-12 reps");
    record86.set("videoUrl", "https://example.com/cable-press");
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
    record87.set("name", "Cable Lateral Raises - Cable - Cable - Shoulders Focus");
    record87.set("equipment", "Cable");
    record87.set("muscleGroup", "Shoulders");
    record87.set("description", "Cable lateral raises for side deltoid isolation");
    record87.set("formTips", "Standing, raise handles to sides, control descent");
    record87.set("recommendedSetsReps", "3 sets x 12-15 reps");
    record87.set("videoUrl", "https://example.com/cable-lateral");
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
    record88.set("name", "Cable Bicep Curls - Cable - Cable - Arms Focus");
    record88.set("equipment", "Cable");
    record88.set("muscleGroup", "Arms");
    record88.set("description", "Cable bicep curls for bicep isolation");
    record88.set("formTips", "Standing, curl handle to shoulder, control descent");
    record88.set("recommendedSetsReps", "3 sets x 10-12 reps");
    record88.set("videoUrl", "https://example.com/cable-curl");
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
    record89.set("name", "Cable Tricep Pushdowns - Cable - Cable - Arms Focus");
    record89.set("equipment", "Cable");
    record89.set("muscleGroup", "Arms");
    record89.set("description", "Cable tricep pushdowns for tricep isolation");
    record89.set("formTips", "Standing, push handle down, control return");
    record89.set("recommendedSetsReps", "3 sets x 12-15 reps");
    record89.set("videoUrl", "https://example.com/cable-pushdown");
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
    record90.set("name", "Treadmill Running - Cardio Equipment - Cardio Equipment - Cardio Focus");
    record90.set("equipment", "Cardio Equipment");
    record90.set("muscleGroup", "Cardio");
    record90.set("description", "Treadmill running for cardiovascular endurance");
    record90.set("formTips", "Maintain steady pace, upright posture, natural arm swing");
    record90.set("recommendedSetsReps", "20-30 minutes steady state");
    record90.set("videoUrl", "https://example.com/treadmill");
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
    record91.set("name", "Rowing Machine - Cardio Equipment - Cardio Equipment - Cardio Focus");
    record91.set("equipment", "Cardio Equipment");
    record91.set("muscleGroup", "Cardio");
    record91.set("description", "Rowing machine for full body cardio");
    record91.set("formTips", "Drive with legs, pull with back, control return");
    record91.set("recommendedSetsReps", "20-30 minutes steady state");
    record91.set("videoUrl", "https://example.com/rowing");
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
    record92.set("name", "Stationary Bike - Cardio Equipment - Cardio Equipment - Cardio Focus");
    record92.set("equipment", "Cardio Equipment");
    record92.set("muscleGroup", "Cardio");
    record92.set("description", "Stationary bike for lower body cardio");
    record92.set("formTips", "Maintain steady cadence, upright posture");
    record92.set("recommendedSetsReps", "20-30 minutes steady state");
    record92.set("videoUrl", "https://example.com/bike");
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
    record93.set("name", "Elliptical Machine - Cardio Equipment - Cardio Equipment - Cardio Focus");
    record93.set("equipment", "Cardio Equipment");
    record93.set("muscleGroup", "Cardio");
    record93.set("description", "Elliptical machine for low-impact cardio");
    record93.set("formTips", "Maintain steady pace, upright posture");
    record93.set("recommendedSetsReps", "20-30 minutes steady state");
    record93.set("videoUrl", "https://example.com/elliptical");
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
    record94.set("name", "Planks - Bodyweight - Bodyweight - Abs-Core Focus");
    record94.set("equipment", "Bodyweight");
    record94.set("muscleGroup", "Abs-Core");
    record94.set("description", "Front planks for core stability");
    record94.set("formTips", "Straight body line, engage core, avoid sagging hips");
    record94.set("recommendedSetsReps", "3 sets x 30-60 seconds");
    record94.set("videoUrl", "https://example.com/plank");
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
    record95.set("name", "Side Planks - Bodyweight - Bodyweight - Abs-Core Focus");
    record95.set("equipment", "Bodyweight");
    record95.set("muscleGroup", "Abs-Core");
    record95.set("description", "Side planks for oblique and core strength");
    record95.set("formTips", "Straight body line, engage core, avoid sagging hips");
    record95.set("recommendedSetsReps", "3 sets x 20-40 seconds per side");
    record95.set("videoUrl", "https://example.com/side-plank");
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
    record96.set("name", "Crunches - Bodyweight - Bodyweight - Abs-Core Focus");
    record96.set("equipment", "Bodyweight");
    record96.set("muscleGroup", "Abs-Core");
    record96.set("description", "Crunches for abdominal isolation");
    record96.set("formTips", "Hands behind head, curl up, control descent");
    record96.set("recommendedSetsReps", "3 sets x 15-20 reps");
    record96.set("videoUrl", "https://example.com/crunch");
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
    record97.set("name", "Leg Raises - Bodyweight - Bodyweight - Abs-Core Focus");
    record97.set("equipment", "Bodyweight");
    record97.set("muscleGroup", "Abs-Core");
    record97.set("description", "Leg raises for lower abdominal strength");
    record97.set("formTips", "Lying down, raise legs to 90 degrees, control descent");
    record97.set("recommendedSetsReps", "3 sets x 10-15 reps");
    record97.set("videoUrl", "https://example.com/leg-raise");
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
    record98.set("name", "Russian Twists - Bodyweight - Bodyweight - Abs-Core Focus");
    record98.set("equipment", "Bodyweight");
    record98.set("muscleGroup", "Abs-Core");
    record98.set("description", "Russian twists for oblique strength");
    record98.set("formTips", "Seated, lean back, twist side to side, control motion");
    record98.set("recommendedSetsReps", "3 sets x 20 reps total");
    record98.set("videoUrl", "https://example.com/russian-twist");
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
    record99.set("name", "Stretching - Hamstrings - Bodyweight - Flexibility Focus");
    record99.set("equipment", "Bodyweight");
    record99.set("muscleGroup", "Flexibility");
    record99.set("description", "Hamstring stretching for flexibility");
    record99.set("formTips", "Bend forward, reach toward toes, hold stretch");
    record99.set("recommendedSetsReps", "3 sets x 30 seconds");
    record99.set("videoUrl", "https://example.com/stretch-hamstring");
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
    record100.set("name", "Stretching - Hip Flexors - Bodyweight - Flexibility Focus");
    record100.set("equipment", "Bodyweight");
    record100.set("muscleGroup", "Flexibility");
    record100.set("description", "Hip flexor stretching for mobility");
    record100.set("formTips", "Lunge position, push hips forward, hold stretch");
    record100.set("recommendedSetsReps", "3 sets x 30 seconds per side");
    record100.set("videoUrl", "https://example.com/stretch-hip");
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
    record101.set("name", "Stretching - Shoulders - Bodyweight - Flexibility Focus");
    record101.set("equipment", "Bodyweight");
    record101.set("muscleGroup", "Flexibility");
    record101.set("description", "Shoulder stretching for mobility");
    record101.set("formTips", "Cross arm over body, pull gently, hold stretch");
    record101.set("recommendedSetsReps", "3 sets x 30 seconds per side");
    record101.set("videoUrl", "https://example.com/stretch-shoulder");
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
    record102.set("name", "Stretching - Chest - Bodyweight - Flexibility Focus");
    record102.set("equipment", "Bodyweight");
    record102.set("muscleGroup", "Flexibility");
    record102.set("description", "Chest stretching for mobility");
    record102.set("formTips", "Doorway stretch, push chest forward, hold stretch");
    record102.set("recommendedSetsReps", "3 sets x 30 seconds");
    record102.set("videoUrl", "https://example.com/stretch-chest");
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
    record103.set("name", "Stretching - Back - Bodyweight - Flexibility Focus");
    record103.set("equipment", "Bodyweight");
    record103.set("muscleGroup", "Flexibility");
    record103.set("description", "Back stretching for mobility");
    record103.set("formTips", "Child's pose, relax into stretch, hold position");
    record103.set("recommendedSetsReps", "3 sets x 30 seconds");
    record103.set("videoUrl", "https://example.com/stretch-back");
  try {
    app.save(record103);
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
