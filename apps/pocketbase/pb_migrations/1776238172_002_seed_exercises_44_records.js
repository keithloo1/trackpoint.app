/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("exercises");

  const record0 = new Record(collection);
    record0.set("name", "Push Ups");
    record0.set("equipment", "Bodyweight");
    record0.set("muscleGroup", "Chest");
    record0.set("description", "Classic upper body exercise that targets chest, shoulders, and triceps");
    record0.set("formTips", "Keep your body in a straight line from head to heels. Lower your body until your chest nearly touches the floor, then push back up.");
    record0.set("recommendedSetsReps", "3x8-10");
    record0.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record1.set("name", "Dumbbell Press");
    record1.set("equipment", "Dumbbell");
    record1.set("muscleGroup", "Chest");
    record1.set("description", "Pressing movement using dumbbells to build chest strength and stability");
    record1.set("formTips", "Press dumbbells up and slightly inward. Control the descent and avoid bouncing at the bottom.");
    record1.set("recommendedSetsReps", "3x8-10");
    record1.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record2.set("name", "Barbell Bench Press");
    record2.set("equipment", "Barbell");
    record2.set("muscleGroup", "Chest");
    record2.set("description", "Primary compound movement for chest development");
    record2.set("formTips", "Lower the bar to your mid-chest, keep elbows at 45 degrees, and press explosively upward.");
    record2.set("recommendedSetsReps", "3x5-8");
    record2.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record3.set("name", "Incline Push Ups");
    record3.set("equipment", "Bodyweight");
    record3.set("muscleGroup", "Chest");
    record3.set("description", "Modified push up with hands elevated to reduce difficulty");
    record3.set("formTips", "Place hands on an elevated surface. Maintain a straight body line and lower chest to the surface.");
    record3.set("recommendedSetsReps", "3x8-12");
    record3.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record4.set("name", "Dips");
    record4.set("equipment", "Pull-up Bar");
    record4.set("muscleGroup", "Chest");
    record4.set("description", "Bodyweight exercise using parallel bars for chest and tricep development");
    record4.set("formTips", "Lean forward slightly to emphasize chest. Lower your body until elbows are at 90 degrees.");
    record4.set("recommendedSetsReps", "3x6-10");
    record4.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record5.set("name", "Cable Flyes");
    record5.set("equipment", "Bench");
    record5.set("muscleGroup", "Chest");
    record5.set("description", "Isolation exercise for chest using cable machine");
    record5.set("formTips", "Keep a slight bend in your elbows. Bring cables together in a controlled arc motion.");
    record5.set("recommendedSetsReps", "3x10-12");
    record5.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record6.set("name", "Machine Press");
    record6.set("equipment", "Bench");
    record6.set("muscleGroup", "Chest");
    record6.set("description", "Guided pressing movement on chest press machine");
    record6.set("formTips", "Sit upright with back against pad. Press handles forward and return with control.");
    record6.set("recommendedSetsReps", "3x10-12");
    record6.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record7.set("name", "Pull Ups");
    record7.set("equipment", "Pull-up Bar");
    record7.set("muscleGroup", "Back");
    record7.set("description", "Fundamental back exercise using bodyweight");
    record7.set("formTips", "Use a grip slightly wider than shoulder width. Pull yourself up until chin clears the bar.");
    record7.set("recommendedSetsReps", "3x5-10");
    record7.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record8.set("name", "Dumbbell Rows");
    record8.set("equipment", "Dumbbell");
    record8.set("muscleGroup", "Back");
    record8.set("description", "Single-arm rowing movement for back development");
    record8.set("formTips", "Keep your core tight and row the dumbbell to your hip. Avoid rotating your torso.");
    record8.set("recommendedSetsReps", "3x8-10");
    record8.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record9.set("name", "Barbell Rows");
    record9.set("equipment", "Barbell");
    record9.set("muscleGroup", "Back");
    record9.set("description", "Compound back exercise with barbell");
    record9.set("formTips", "Hinge at hips with slight knee bend. Row the bar to your lower chest, keeping elbows close.");
    record9.set("recommendedSetsReps", "3x5-8");
    record9.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record10.set("name", "Lat Pulldowns");
    record10.set("equipment", "Bench");
    record10.set("muscleGroup", "Back");
    record10.set("description", "Machine-based back exercise targeting latissimus dorsi");
    record10.set("formTips", "Pull the bar down to your chest, squeeze your lats, and control the return.");
    record10.set("recommendedSetsReps", "3x8-12");
    record10.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record11.set("name", "Face Pulls");
    record11.set("equipment", "Bands");
    record11.set("muscleGroup", "Back");
    record11.set("description", "Rear shoulder and back exercise using resistance bands");
    record11.set("formTips", "Pull the band toward your face, separating the ends. Squeeze your rear delts at the top.");
    record11.set("recommendedSetsReps", "3x12-15");
    record11.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record12.set("name", "Reverse Flyes");
    record12.set("equipment", "Dumbbell");
    record12.set("muscleGroup", "Back");
    record12.set("description", "Isolation exercise for rear shoulders and upper back");
    record12.set("formTips", "Hinge forward slightly. Raise dumbbells out to the sides with a slight bend in elbows.");
    record12.set("recommendedSetsReps", "3x10-12");
    record12.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record13.set("name", "Inverted Rows");
    record13.set("equipment", "Pull-up Bar");
    record13.set("muscleGroup", "Back");
    record13.set("description", "Bodyweight rowing exercise using a low bar");
    record13.set("formTips", "Keep your body straight. Pull your chest toward the bar, squeezing your back muscles.");
    record13.set("recommendedSetsReps", "3x8-12");
    record13.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record14.set("name", "Barbell OHP");
    record14.set("equipment", "Barbell");
    record14.set("muscleGroup", "Shoulders");
    record14.set("description", "Overhead pressing movement for shoulder strength");
    record14.set("formTips", "Press the bar overhead in a straight line. Keep your core tight and avoid arching excessively.");
    record14.set("recommendedSetsReps", "3x5-8");
    record14.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record15.set("name", "Dumbbell Shoulder Press");
    record15.set("equipment", "Dumbbell");
    record15.set("muscleGroup", "Shoulders");
    record15.set("description", "Pressing movement using dumbbells for shoulder development");
    record15.set("formTips", "Press dumbbells overhead, slightly inward. Control the descent to shoulder height.");
    record15.set("recommendedSetsReps", "3x8-10");
    record15.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record16.set("name", "Lateral Raises");
    record16.set("equipment", "Dumbbell");
    record16.set("muscleGroup", "Shoulders");
    record16.set("description", "Isolation exercise for lateral deltoids");
    record16.set("formTips", "Raise dumbbells out to the sides with a slight bend in elbows. Lead with your elbows, not hands.");
    record16.set("recommendedSetsReps", "3x10-12");
    record16.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record17.set("name", "Front Raises");
    record17.set("equipment", "Dumbbell");
    record17.set("muscleGroup", "Shoulders");
    record17.set("description", "Front deltoid isolation exercise");
    record17.set("formTips", "Raise dumbbells in front of you to shoulder height. Keep a slight bend in your elbows.");
    record17.set("recommendedSetsReps", "3x10-12");
    record17.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record18.set("name", "Shrugs");
    record18.set("equipment", "Barbell");
    record18.set("muscleGroup", "Shoulders");
    record18.set("description", "Trapezius exercise using barbell");
    record18.set("formTips", "Hold the bar at your sides. Shrug your shoulders up toward your ears, pause, and lower.");
    record18.set("recommendedSetsReps", "3x8-12");
    record18.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record19.set("name", "Pike Push Ups");
    record19.set("equipment", "Bodyweight");
    record19.set("muscleGroup", "Shoulders");
    record19.set("description", "Modified push up targeting shoulders");
    record19.set("formTips", "Form an inverted V shape with your body. Lower your head toward the ground between your hands.");
    record19.set("recommendedSetsReps", "3x8-12");
    record19.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record20.set("name", "Barbell Squat");
    record20.set("equipment", "Barbell");
    record20.set("muscleGroup", "Legs");
    record20.set("description", "Fundamental lower body compound movement");
    record20.set("formTips", "Keep chest up and knees tracking over toes. Descend until thighs are parallel to ground.");
    record20.set("recommendedSetsReps", "3x5-8");
    record20.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record21.set("name", "Dumbbell Goblet Squat");
    record21.set("equipment", "Dumbbell");
    record21.set("muscleGroup", "Legs");
    record21.set("description", "Squat variation holding a dumbbell at chest");
    record21.set("formTips", "Hold dumbbell vertically at chest. Squat down keeping chest upright and weight in heels.");
    record21.set("recommendedSetsReps", "3x10-12");
    record21.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record22.set("name", "Lunges");
    record22.set("equipment", "Bodyweight");
    record22.set("muscleGroup", "Legs");
    record22.set("description", "Single-leg lower body exercise");
    record22.set("formTips", "Step forward and lower your back knee toward the ground. Keep your torso upright.");
    record22.set("recommendedSetsReps", "3x10-12");
    record22.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record23.set("name", "Leg Press");
    record23.set("equipment", "Bench");
    record23.set("muscleGroup", "Legs");
    record23.set("description", "Machine-based lower body pressing movement");
    record23.set("formTips", "Place feet shoulder-width apart on platform. Press away from you, stopping before locking knees.");
    record23.set("recommendedSetsReps", "3x8-12");
    record23.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record24.set("name", "Calf Raises");
    record24.set("equipment", "Bodyweight");
    record24.set("muscleGroup", "Legs");
    record24.set("description", "Isolation exercise for calf muscles");
    record24.set("formTips", "Rise up on your toes, pause at the top, and lower with control. Keep movement controlled.");
    record24.set("recommendedSetsReps", "3x12-15");
    record24.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record25.set("name", "Bulgarian Split Squats");
    record25.set("equipment", "Bodyweight");
    record25.set("muscleGroup", "Legs");
    record25.set("description", "Single-leg squat variation with rear foot elevated");
    record25.set("formTips", "Place rear foot on elevated surface. Lower front leg until thigh is parallel to ground.");
    record25.set("recommendedSetsReps", "3x8-10");
    record25.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record26.set("name", "Leg Curls");
    record26.set("equipment", "Bench");
    record26.set("muscleGroup", "Legs");
    record26.set("description", "Machine-based hamstring isolation exercise");
    record26.set("formTips", "Lie face down and curl the pad toward your glutes. Control the return to starting position.");
    record26.set("recommendedSetsReps", "3x10-12");
    record26.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record27.set("name", "Bicep Curls");
    record27.set("equipment", "Dumbbell");
    record27.set("muscleGroup", "Arms");
    record27.set("description", "Primary bicep isolation exercise");
    record27.set("formTips", "Keep elbows at your sides. Curl dumbbells up, pause at the top, and lower with control.");
    record27.set("recommendedSetsReps", "3x8-10");
    record27.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record28.set("name", "Tricep Dips");
    record28.set("equipment", "Pull-up Bar");
    record28.set("muscleGroup", "Arms");
    record28.set("description", "Bodyweight tricep exercise using parallel bars");
    record28.set("formTips", "Lower your body by bending elbows. Keep elbows close to your body for tricep emphasis.");
    record28.set("recommendedSetsReps", "3x6-10");
    record28.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record29.set("name", "Hammer Curls");
    record29.set("equipment", "Dumbbell");
    record29.set("muscleGroup", "Arms");
    record29.set("description", "Bicep curl variation with neutral grip");
    record29.set("formTips", "Hold dumbbells with palms facing each other. Curl up and lower with control.");
    record29.set("recommendedSetsReps", "3x8-10");
    record29.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record30.set("name", "Overhead Tricep Extension");
    record30.set("equipment", "Dumbbell");
    record30.set("muscleGroup", "Arms");
    record30.set("description", "Tricep isolation exercise with dumbbell overhead");
    record30.set("formTips", "Hold dumbbell overhead with both hands. Lower behind your head, keeping elbows stationary.");
    record30.set("recommendedSetsReps", "3x10-12");
    record30.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record31.set("name", "Preacher Curls");
    record31.set("equipment", "Bench");
    record31.set("muscleGroup", "Arms");
    record31.set("description", "Bicep curl variation using preacher bench");
    record31.set("formTips", "Rest your arms on the bench. Curl the bar up, pause, and lower with control.");
    record31.set("recommendedSetsReps", "3x8-10");
    record31.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record32.set("name", "Skull Crushers");
    record32.set("equipment", "Barbell");
    record32.set("muscleGroup", "Arms");
    record32.set("description", "Tricep isolation exercise with barbell");
    record32.set("formTips", "Lower the bar toward your forehead, keeping elbows stationary. Press back to starting position.");
    record32.set("recommendedSetsReps", "3x8-10");
    record32.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record33.set("name", "Plank");
    record33.set("equipment", "Bodyweight");
    record33.set("muscleGroup", "Abs-Core");
    record33.set("description", "Isometric core strengthening exercise");
    record33.set("formTips", "Keep your body in a straight line from head to heels. Engage your core and avoid sagging hips.");
    record33.set("recommendedSetsReps", "3x30-60s");
    record33.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record34.set("name", "Crunches");
    record34.set("equipment", "Bodyweight");
    record34.set("muscleGroup", "Abs-Core");
    record34.set("description", "Abdominal isolation exercise");
    record34.set("formTips", "Lie on your back with knees bent. Curl your shoulders toward your hips, pause, and lower.");
    record34.set("recommendedSetsReps", "3x12-15");
    record34.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record35.set("name", "Leg Raises");
    record35.set("equipment", "Bodyweight");
    record35.set("muscleGroup", "Abs-Core");
    record35.set("description", "Lower abdominal exercise");
    record35.set("formTips", "Lie on your back with legs straight. Raise legs to 90 degrees, lower without touching ground.");
    record35.set("recommendedSetsReps", "3x10-12");
    record35.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record36.set("name", "Russian Twists");
    record36.set("equipment", "Bodyweight");
    record36.set("muscleGroup", "Abs-Core");
    record36.set("description", "Oblique and core rotation exercise");
    record36.set("formTips", "Sit with knees bent and lean back slightly. Rotate your torso side to side, touching ground.");
    record36.set("recommendedSetsReps", "3x12-15");
    record36.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record37.set("name", "Mountain Climbers");
    record37.set("equipment", "Bodyweight");
    record37.set("muscleGroup", "Abs-Core");
    record37.set("description", "Dynamic core and cardio exercise");
    record37.set("formTips", "Start in plank position. Alternate driving knees toward chest in a running motion.");
    record37.set("recommendedSetsReps", "3x20");
    record37.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record38.set("name", "Ab Wheel Rollouts");
    record38.set("equipment", "Bodyweight");
    record38.set("muscleGroup", "Abs-Core");
    record38.set("description", "Advanced core strengthening exercise");
    record38.set("formTips", "Kneel and roll the wheel forward, extending your body. Roll back to starting position.");
    record38.set("recommendedSetsReps", "3x8-12");
    record38.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record39.set("name", "Hanging Leg Raises");
    record39.set("equipment", "Pull-up Bar");
    record39.set("muscleGroup", "Abs-Core");
    record39.set("description", "Advanced lower abdominal exercise");
    record39.set("formTips", "Hang from a bar with straight arms. Raise legs to 90 degrees, lower without swinging.");
    record39.set("recommendedSetsReps", "3x8-12");
    record39.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record40.set("name", "Burpees");
    record40.set("equipment", "Bodyweight");
    record40.set("muscleGroup", "Full Body");
    record40.set("description", "Full body explosive exercise combining cardio and strength");
    record40.set("formTips", "From standing, drop to plank, do a push up, jump feet to hands, and jump up explosively.");
    record40.set("recommendedSetsReps", "3x10-12");
    record40.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record41.set("name", "Kettlebell Swings");
    record41.set("equipment", "Kettlebell");
    record41.set("muscleGroup", "Full Body");
    record41.set("description", "Dynamic full body exercise with kettlebell");
    record41.set("formTips", "Hinge at hips and swing kettlebell between legs. Drive hips forward to swing up to chest height.");
    record41.set("recommendedSetsReps", "3x15-20");
    record41.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record42.set("name", "Clean and Press");
    record42.set("equipment", "Barbell");
    record42.set("muscleGroup", "Full Body");
    record42.set("description", "Olympic lifting movement combining clean and overhead press");
    record42.set("formTips", "Clean the bar to shoulders, then press overhead. Maintain upright posture throughout.");
    record42.set("recommendedSetsReps", "3x5-8");
    record42.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
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
    record43.set("name", "Deadlifts");
    record43.set("equipment", "Barbell");
    record43.set("muscleGroup", "Full Body");
    record43.set("description", "Fundamental compound movement for full body strength");
    record43.set("formTips", "Keep bar close to body. Drive through heels and extend hips and knees simultaneously.");
    record43.set("recommendedSetsReps", "3x3-5");
    record43.set("videoUrl", "https://videos.pexels.com/video-files/3536256/3536256-sd_640_360_25fps.mp4");
  try {
    app.save(record43);
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
