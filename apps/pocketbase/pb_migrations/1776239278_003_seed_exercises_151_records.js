/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("exercises");

  const record0 = new Record(collection);
    record0.set("name", "Running - Sprints");
    record0.set("equipment", "Cardio Equipment");
    record0.set("muscleGroup", "Cardio");
    record0.set("description", "High-intensity short-distance running at maximum effort");
    record0.set("formTips", "Maintain upright posture, drive knees high, land on midfoot");
    record0.set("recommendedSetsReps", "8-10 x 30-60 seconds");
    record0.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record1.set("name", "Running - Steady State");
    record1.set("equipment", "Cardio Equipment");
    record1.set("muscleGroup", "Cardio");
    record1.set("description", "Moderate-intensity running at a sustainable pace");
    record1.set("formTips", "Keep consistent breathing, maintain relaxed shoulders, land heel-to-toe");
    record1.set("recommendedSetsReps", "20-60 minutes continuous");
    record1.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record2.set("name", "Running - Long Distance");
    record2.set("equipment", "Cardio Equipment");
    record2.set("muscleGroup", "Cardio");
    record2.set("description", "Extended duration running for endurance building");
    record2.set("formTips", "Maintain steady pace, focus on breathing rhythm, stay hydrated");
    record2.set("recommendedSetsReps", "60+ minutes");
    record2.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record3.set("name", "Running - Hill Runs");
    record3.set("equipment", "Cardio Equipment");
    record3.set("muscleGroup", "Cardio");
    record3.set("description", "Running uphill to build leg strength and power");
    record3.set("formTips", "Lean slightly forward, shorten stride, drive through glutes");
    record3.set("recommendedSetsReps", "6-10 x 30-90 seconds");
    record3.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record4.set("name", "Running - Track Runs");
    record4.set("equipment", "Cardio Equipment");
    record4.set("muscleGroup", "Cardio");
    record4.set("description", "Structured running intervals on a track");
    record4.set("formTips", "Use proper running form, maintain consistent pace per lap");
    record4.set("recommendedSetsReps", "Varies by distance");
    record4.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record5.set("name", "Jogging - Easy Pace");
    record5.set("equipment", "Cardio Equipment");
    record5.set("muscleGroup", "Cardio");
    record5.set("description", "Low-intensity jogging for recovery and base building");
    record5.set("formTips", "Relaxed posture, conversational pace, natural arm swing");
    record5.set("recommendedSetsReps", "20-45 minutes");
    record5.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record6.set("name", "Jogging - Tempo Jogs");
    record6.set("equipment", "Cardio Equipment");
    record6.set("muscleGroup", "Cardio");
    record6.set("description", "Sustained moderate-to-hard intensity jogging");
    record6.set("formTips", "Maintain steady effort, controlled breathing, consistent pace");
    record6.set("recommendedSetsReps", "20-40 minutes");
    record6.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record7.set("name", "Cycling - Stationary Bike");
    record7.set("equipment", "Cardio Equipment");
    record7.set("muscleGroup", "Cardio");
    record7.set("description", "Indoor cycling on a stationary bike for cardio and leg strength");
    record7.set("formTips", "Adjust seat height, maintain cadence, engage core");
    record7.set("recommendedSetsReps", "20-60 minutes");
    record7.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record8.set("name", "Cycling - Outdoor Cycling");
    record8.set("equipment", "Cardio Equipment");
    record8.set("muscleGroup", "Cardio");
    record8.set("description", "Outdoor cycling for endurance and leg development");
    record8.set("formTips", "Maintain proper bike fit, vary terrain, control pace");
    record8.set("recommendedSetsReps", "30-120 minutes");
    record8.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record9.set("name", "Cycling - Spin Classes");
    record9.set("equipment", "Cardio Equipment");
    record9.set("muscleGroup", "Cardio");
    record9.set("description", "High-energy group cycling classes with music");
    record9.set("formTips", "Follow instructor cues, adjust resistance appropriately, stay hydrated");
    record9.set("recommendedSetsReps", "45-60 minutes");
    record9.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record10.set("name", "Rowing Machine");
    record10.set("equipment", "Cardio Equipment");
    record10.set("muscleGroup", "Full Body");
    record10.set("description", "Full-body cardio and strength exercise using rowing machine");
    record10.set("formTips", "Drive through legs first, engage back, finish with arms");
    record10.set("recommendedSetsReps", "20-45 minutes or 500m-5000m intervals");
    record10.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record11.set("name", "Water Rowing");
    record11.set("equipment", "Cardio Equipment");
    record11.set("muscleGroup", "Full Body");
    record11.set("description", "Rowing in water for resistance and coordination");
    record11.set("formTips", "Maintain balance, smooth strokes, engage core");
    record11.set("recommendedSetsReps", "20-45 minutes");
    record11.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record12.set("name", "Jump Rope - Single Unders");
    record12.set("equipment", "Bodyweight");
    record12.set("muscleGroup", "Cardio");
    record12.set("description", "Basic jump rope with one rotation per jump");
    record12.set("formTips", "Stay on balls of feet, keep elbows close, maintain rhythm");
    record12.set("recommendedSetsReps", "3 x 1-3 minutes");
    record12.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record13.set("name", "Jump Rope - Double Unders");
    record13.set("equipment", "Bodyweight");
    record13.set("muscleGroup", "Cardio");
    record13.set("description", "Jump rope with two rotations per jump");
    record13.set("formTips", "Increase wrist speed, jump slightly higher, maintain rhythm");
    record13.set("recommendedSetsReps", "3 x 30-60 seconds");
    record13.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record14.set("name", "Jump Rope - Speed Rope");
    record14.set("equipment", "Bodyweight");
    record14.set("muscleGroup", "Cardio");
    record14.set("description", "Fast-paced jump rope for coordination and speed");
    record14.set("formTips", "Quick wrist flicks, minimal jump height, stay relaxed");
    record14.set("recommendedSetsReps", "3 x 1-2 minutes");
    record14.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record15.set("name", "Stair Climbing");
    record15.set("equipment", "Cardio Equipment");
    record15.set("muscleGroup", "Legs");
    record15.set("description", "Climbing stairs for leg strength and cardio");
    record15.set("formTips", "Lean slightly forward, drive through glutes, maintain steady pace");
    record15.set("recommendedSetsReps", "10-20 minutes or 5-10 flights");
    record15.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record16.set("name", "Stair Machine");
    record16.set("equipment", "Machine");
    record16.set("muscleGroup", "Legs");
    record16.set("description", "Stair climbing machine for controlled leg workout");
    record16.set("formTips", "Maintain upright posture, don't lean on handrails, engage glutes");
    record16.set("recommendedSetsReps", "15-30 minutes");
    record16.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record17.set("name", "Elliptical Machine");
    record17.set("equipment", "Machine");
    record17.set("muscleGroup", "Cardio");
    record17.set("description", "Low-impact cardio machine for full-body workout");
    record17.set("formTips", "Maintain upright posture, engage core, use arms for balance");
    record17.set("recommendedSetsReps", "20-45 minutes");
    record17.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record18.set("name", "Swimming - Freestyle");
    record18.set("equipment", "Cardio Equipment");
    record18.set("muscleGroup", "Full Body");
    record18.set("description", "Front crawl swimming for full-body cardio");
    record18.set("formTips", "Bilateral breathing, high elbow catch, streamlined body position");
    record18.set("recommendedSetsReps", "20-45 minutes or 1000m-3000m");
    record18.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record19.set("name", "Swimming - Backstroke");
    record19.set("equipment", "Cardio Equipment");
    record19.set("muscleGroup", "Full Body");
    record19.set("description", "Back swimming stroke for shoulder and back development");
    record19.set("formTips", "Maintain horizontal body position, high elbow recovery, steady kick");
    record19.set("recommendedSetsReps", "20-45 minutes or 1000m-3000m");
    record19.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record20.set("name", "Swimming - Breaststroke");
    record20.set("equipment", "Cardio Equipment");
    record20.set("muscleGroup", "Full Body");
    record20.set("description", "Breaststroke for chest and leg development");
    record20.set("formTips", "Simultaneous arm and leg movements, streamlined glide phase");
    record20.set("recommendedSetsReps", "20-45 minutes or 1000m-3000m");
    record20.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record21.set("name", "Swimming - Butterfly");
    record21.set("equipment", "Cardio Equipment");
    record21.set("muscleGroup", "Full Body");
    record21.set("description", "Advanced butterfly stroke for full-body power");
    record21.set("formTips", "Simultaneous arm movements, dolphin kick, explosive power");
    record21.set("recommendedSetsReps", "10-30 minutes or 500m-2000m");
    record21.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record22.set("name", "Treadmill - Incline Walking");
    record22.set("equipment", "Machine");
    record22.set("muscleGroup", "Cardio");
    record22.set("description", "Walking on inclined treadmill for glute and leg activation");
    record22.set("formTips", "Maintain upright posture, engage glutes, controlled pace");
    record22.set("recommendedSetsReps", "20-45 minutes");
    record22.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record23.set("name", "Treadmill - Sprints");
    record23.set("equipment", "Machine");
    record23.set("muscleGroup", "Cardio");
    record23.set("description", "High-speed running intervals on treadmill");
    record23.set("formTips", "Maintain form at speed, drive knees, land midfoot");
    record23.set("recommendedSetsReps", "8-12 x 30-60 seconds");
    record23.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record24.set("name", "Burpees");
    record24.set("equipment", "Bodyweight");
    record24.set("muscleGroup", "Full Body");
    record24.set("description", "Full-body explosive movement combining squat, plank, and jump");
    record24.set("formTips", "Maintain plank position, explosive jump, land softly");
    record24.set("recommendedSetsReps", "3 x 10-20 reps");
    record24.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record25.set("name", "Mountain Climbers");
    record25.set("equipment", "Bodyweight");
    record25.set("muscleGroup", "Full Body");
    record25.set("description", "Dynamic core and cardio exercise in plank position");
    record25.set("formTips", "Keep hips level, drive knees explosively, maintain plank form");
    record25.set("recommendedSetsReps", "3 x 30-60 seconds");
    record25.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record26.set("name", "High Knees");
    record26.set("equipment", "Bodyweight");
    record26.set("muscleGroup", "Cardio");
    record26.set("description", "Running in place with knees driven high");
    record26.set("formTips", "Drive knees to hip height, maintain upright posture, quick cadence");
    record26.set("recommendedSetsReps", "3 x 30-60 seconds");
    record26.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record27.set("name", "Jumping Jacks");
    record27.set("equipment", "Bodyweight");
    record27.set("muscleGroup", "Cardio");
    record27.set("description", "Classic full-body cardio exercise");
    record27.set("formTips", "Land softly, maintain rhythm, keep core engaged");
    record27.set("recommendedSetsReps", "3 x 30-60 seconds");
    record27.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record28.set("name", "Box Jumps");
    record28.set("equipment", "Bench");
    record28.set("muscleGroup", "Legs");
    record28.set("description", "Explosive jumping onto elevated platform");
    record28.set("formTips", "Swing arms, explosive leg drive, land softly with bent knees");
    record28.set("recommendedSetsReps", "3-5 x 5-8 reps");
    record28.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record29.set("name", "Jump Squats");
    record29.set("equipment", "Bodyweight");
    record29.set("muscleGroup", "Legs");
    record29.set("description", "Explosive squat with vertical jump");
    record29.set("formTips", "Full squat depth, explosive jump, land softly");
    record29.set("recommendedSetsReps", "3 x 10-15 reps");
    record29.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record30.set("name", "Plyometric Push Ups");
    record30.set("equipment", "Bodyweight");
    record30.set("muscleGroup", "Chest");
    record30.set("description", "Push ups with explosive hand lift-off");
    record30.set("formTips", "Explosive push, hands leave ground, land softly");
    record30.set("recommendedSetsReps", "3 x 8-12 reps");
    record30.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record31.set("name", "Lateral Bounds");
    record31.set("equipment", "Bodyweight");
    record31.set("muscleGroup", "Legs");
    record31.set("description", "Explosive side-to-side jumping for lateral power");
    record31.set("formTips", "Push off explosively, land on single leg, maintain balance");
    record31.set("recommendedSetsReps", "3 x 10-15 reps per side");
    record31.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record32.set("name", "Skater Hops");
    record32.set("equipment", "Bodyweight");
    record32.set("muscleGroup", "Legs");
    record32.set("description", "Lateral jumping movement mimicking ice skating");
    record32.set("formTips", "Explosive lateral push, land on single leg, swing arms");
    record32.set("recommendedSetsReps", "3 x 20-30 reps");
    record32.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record33.set("name", "Clap Push Ups");
    record33.set("equipment", "Bodyweight");
    record33.set("muscleGroup", "Chest");
    record33.set("description", "Push ups with explosive hand clap at top");
    record33.set("formTips", "Explosive push, clap hands, land softly with bent elbows");
    record33.set("recommendedSetsReps", "3 x 5-10 reps");
    record33.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record34.set("name", "Push Ups - Standard");
    record34.set("equipment", "Bodyweight");
    record34.set("muscleGroup", "Chest");
    record34.set("description", "Classic push up for chest, shoulders, and triceps");
    record34.set("formTips", "Straight body line, elbows at 45 degrees, full range of motion");
    record34.set("recommendedSetsReps", "3 x 10-20 reps");
    record34.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record35.set("name", "Push Ups - Wide Grip");
    record35.set("equipment", "Bodyweight");
    record35.set("muscleGroup", "Chest");
    record35.set("description", "Push ups with hands wider than shoulder width");
    record35.set("formTips", "Hands wider apart, emphasize chest, maintain body alignment");
    record35.set("recommendedSetsReps", "3 x 8-15 reps");
    record35.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record36.set("name", "Push Ups - Diamond");
    record36.set("equipment", "Bodyweight");
    record36.set("muscleGroup", "Arms");
    record36.set("description", "Push ups with hands forming diamond shape");
    record36.set("formTips", "Hands close together, elbows tucked, emphasize triceps");
    record36.set("recommendedSetsReps", "3 x 8-12 reps");
    record36.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record37.set("name", "Push Ups - Decline");
    record37.set("equipment", "Bench");
    record37.set("muscleGroup", "Chest");
    record37.set("description", "Push ups with feet elevated on bench");
    record37.set("formTips", "Feet elevated, maintain body line, emphasize upper chest");
    record37.set("recommendedSetsReps", "3 x 8-15 reps");
    record37.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record38.set("name", "Push Ups - Archer");
    record38.set("equipment", "Bodyweight");
    record38.set("muscleGroup", "Chest");
    record38.set("description", "Push ups with one arm extended, one arm bent");
    record38.set("formTips", "Shift weight to bent arm, keep body straight, alternate sides");
    record38.set("recommendedSetsReps", "3 x 8-12 reps per side");
    record38.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record39.set("name", "Dumbbell Press - Flat");
    record39.set("equipment", "Dumbbell");
    record39.set("muscleGroup", "Chest");
    record39.set("description", "Dumbbell pressing on flat bench");
    record39.set("formTips", "Full range of motion, elbows at 45 degrees, controlled descent");
    record39.set("recommendedSetsReps", "3-4 x 8-12 reps");
    record39.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record40.set("name", "Dumbbell Press - Incline");
    record40.set("equipment", "Dumbbell");
    record40.set("muscleGroup", "Chest");
    record40.set("description", "Dumbbell pressing on inclined bench");
    record40.set("formTips", "30-45 degree incline, emphasize upper chest, controlled movement");
    record40.set("recommendedSetsReps", "3-4 x 8-12 reps");
    record40.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record41.set("name", "Dumbbell Press - Decline");
    record41.set("equipment", "Dumbbell");
    record41.set("muscleGroup", "Chest");
    record41.set("description", "Dumbbell pressing on declined bench");
    record41.set("formTips", "Feet elevated, emphasize lower chest, full range of motion");
    record41.set("recommendedSetsReps", "3-4 x 8-12 reps");
    record41.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record42.set("name", "Barbell Bench Press - Flat");
    record42.set("equipment", "Barbell");
    record42.set("muscleGroup", "Chest");
    record42.set("description", "Classic barbell bench press on flat bench");
    record42.set("formTips", "Feet planted, shoulder blades retracted, elbows at 45 degrees");
    record42.set("recommendedSetsReps", "3-5 x 5-8 reps");
    record42.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record43.set("name", "Barbell Bench Press - Incline");
    record43.set("equipment", "Barbell");
    record43.set("muscleGroup", "Chest");
    record43.set("description", "Barbell bench press on inclined bench");
    record43.set("formTips", "30-45 degree incline, emphasize upper chest, controlled descent");
    record43.set("recommendedSetsReps", "3-4 x 6-10 reps");
    record43.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record44.set("name", "Barbell Bench Press - Decline");
    record44.set("equipment", "Barbell");
    record44.set("muscleGroup", "Chest");
    record44.set("description", "Barbell bench press on declined bench");
    record44.set("formTips", "Feet secured, emphasize lower chest, full range of motion");
    record44.set("recommendedSetsReps", "3-4 x 6-10 reps");
    record44.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record45.set("name", "Machine Chest Press");
    record45.set("equipment", "Machine");
    record45.set("muscleGroup", "Chest");
    record45.set("description", "Guided chest press machine for controlled movement");
    record45.set("formTips", "Adjust seat height, full range of motion, controlled pace");
    record45.set("recommendedSetsReps", "3-4 x 10-15 reps");
    record45.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record46.set("name", "Cable Flyes");
    record46.set("equipment", "Cable");
    record46.set("muscleGroup", "Chest");
    record46.set("description", "Cable machine chest flyes for isolation");
    record46.set("formTips", "Slight bend in elbows, controlled arc, squeeze at top");
    record46.set("recommendedSetsReps", "3 x 10-15 reps");
    record46.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record47.set("name", "Dips - Chest Focused");
    record47.set("equipment", "Bench");
    record47.set("muscleGroup", "Chest");
    record47.set("description", "Dips with forward lean to emphasize chest");
    record47.set("formTips", "Lean forward, lower chest to bar, full range of motion");
    record47.set("recommendedSetsReps", "3 x 8-12 reps");
    record47.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record48.set("name", "Resistance Band Press");
    record48.set("equipment", "Bands");
    record48.set("muscleGroup", "Chest");
    record48.set("description", "Chest press using resistance bands");
    record48.set("formTips", "Anchor band, full extension, controlled return");
    record48.set("recommendedSetsReps", "3 x 12-15 reps");
    record48.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record49.set("name", "Pull Ups - Standard");
    record49.set("equipment", "Pull-up Bar");
    record49.set("muscleGroup", "Back");
    record49.set("description", "Standard pull ups for back and arm strength");
    record49.set("formTips", "Shoulder-width grip, full range of motion, chest to bar");
    record49.set("recommendedSetsReps", "3-5 x 5-12 reps");
    record49.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record50.set("name", "Pull Ups - Wide Grip");
    record50.set("equipment", "Pull-up Bar");
    record50.set("muscleGroup", "Back");
    record50.set("description", "Pull ups with wide grip for lat emphasis");
    record50.set("formTips", "Hands wider than shoulders, emphasize lats, controlled descent");
    record50.set("recommendedSetsReps", "3-4 x 5-10 reps");
    record50.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record51.set("name", "Pull Ups - Close Grip");
    record51.set("equipment", "Pull-up Bar");
    record51.set("muscleGroup", "Back");
    record51.set("description", "Pull ups with close grip for back and bicep focus");
    record51.set("formTips", "Hands close together, emphasize back, full range of motion");
    record51.set("recommendedSetsReps", "3-4 x 6-12 reps");
    record51.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record52.set("name", "Pull Ups - Archer");
    record52.set("equipment", "Pull-up Bar");
    record52.set("muscleGroup", "Back");
    record52.set("description", "Pull ups with one arm extended, one arm bent");
    record52.set("formTips", "Shift weight to bent arm, maintain body control, alternate sides");
    record52.set("recommendedSetsReps", "3 x 5-10 reps per side");
    record52.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record53.set("name", "Chin Ups");
    record53.set("equipment", "Pull-up Bar");
    record53.set("muscleGroup", "Back");
    record53.set("description", "Pull ups with underhand grip for bicep emphasis");
    record53.set("formTips", "Underhand grip, emphasize biceps, full range of motion");
    record53.set("recommendedSetsReps", "3-4 x 6-12 reps");
    record53.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record54.set("name", "Lat Pulldowns");
    record54.set("equipment", "Machine");
    record54.set("muscleGroup", "Back");
    record54.set("description", "Machine lat pulldown for back isolation");
    record54.set("formTips", "Adjust seat, pull to chest, controlled return, squeeze lats");
    record54.set("recommendedSetsReps", "3-4 x 10-15 reps");
    record54.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record55.set("name", "Dumbbell Rows - Single Arm");
    record55.set("equipment", "Dumbbell");
    record55.set("muscleGroup", "Back");
    record55.set("description", "Single arm dumbbell rows for unilateral back development");
    record55.set("formTips", "Knee on bench, pull to hip, squeeze shoulder blade, controlled descent");
    record55.set("recommendedSetsReps", "3-4 x 10-12 reps per side");
    record55.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record56.set("name", "Dumbbell Rows - Double Arm");
    record56.set("equipment", "Dumbbell");
    record56.set("muscleGroup", "Back");
    record56.set("description", "Two-arm dumbbell rows for bilateral back strength");
    record56.set("formTips", "Hinge at hips, pull to sides, squeeze shoulder blades, controlled descent");
    record56.set("recommendedSetsReps", "3-4 x 8-12 reps");
    record56.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record57.set("name", "Barbell Rows - Bent Over");
    record57.set("equipment", "Barbell");
    record57.set("muscleGroup", "Back");
    record57.set("description", "Classic bent-over barbell rows for back strength");
    record57.set("formTips", "Hip hinge, neutral spine, pull to chest, squeeze shoulder blades");
    record57.set("recommendedSetsReps", "3-5 x 5-8 reps");
    record57.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record58.set("name", "Barbell Rows - Pendlay");
    record58.set("equipment", "Barbell");
    record58.set("muscleGroup", "Back");
    record58.set("description", "Pendlay rows with chest on bench for strict form");
    record58.set("formTips", "Chest on bench, pull to chest, full range of motion, controlled descent");
    record58.set("recommendedSetsReps", "3-4 x 6-10 reps");
    record58.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record59.set("name", "Machine Rows");
    record59.set("equipment", "Machine");
    record59.set("muscleGroup", "Back");
    record59.set("description", "Guided machine rows for controlled back workout");
    record59.set("formTips", "Adjust seat, pull to chest, squeeze back, controlled return");
    record59.set("recommendedSetsReps", "3-4 x 10-15 reps");
    record59.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record60.set("name", "Face Pulls");
    record60.set("equipment", "Cable");
    record60.set("muscleGroup", "Back");
    record60.set("description", "Cable face pulls for rear shoulder and back development");
    record60.set("formTips", "Pull to face, elbows high, squeeze shoulder blades, controlled return");
    record60.set("recommendedSetsReps", "3 x 12-15 reps");
    record60.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record61.set("name", "Reverse Flyes");
    record61.set("equipment", "Dumbbell");
    record61.set("muscleGroup", "Back");
    record61.set("description", "Dumbbell reverse flyes for rear shoulder isolation");
    record61.set("formTips", "Slight bend in elbows, raise to shoulder height, squeeze rear delts");
    record61.set("recommendedSetsReps", "3 x 12-15 reps");
    record61.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record62.set("name", "Inverted Rows");
    record62.set("equipment", "Pull-up Bar");
    record62.set("muscleGroup", "Back");
    record62.set("description", "Bodyweight rows under bar for back strength");
    record62.set("formTips", "Body straight, pull chest to bar, squeeze shoulder blades");
    record62.set("recommendedSetsReps", "3 x 8-12 reps");
    record62.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record63.set("name", "Resistance Band Pull Aparts");
    record63.set("equipment", "Bands");
    record63.set("muscleGroup", "Back");
    record63.set("description", "Band pull aparts for shoulder and back activation");
    record63.set("formTips", "Arms extended, pull band apart, squeeze shoulder blades, controlled return");
    record63.set("recommendedSetsReps", "3 x 15-20 reps");
    record63.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record64.set("name", "Barbell OHP");
    record64.set("equipment", "Barbell");
    record64.set("muscleGroup", "Shoulders");
    record64.set("description", "Overhead press with barbell for shoulder strength");
    record64.set("formTips", "Feet planted, core tight, press overhead, full lockout");
    record64.set("recommendedSetsReps", "3-5 x 5-8 reps");
    record64.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record65.set("name", "Dumbbell Shoulder Press");
    record65.set("equipment", "Dumbbell");
    record65.set("muscleGroup", "Shoulders");
    record65.set("description", "Dumbbell overhead press for shoulder development");
    record65.set("formTips", "Full range of motion, press overhead, controlled descent");
    record65.set("recommendedSetsReps", "3-4 x 8-12 reps");
    record65.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record66.set("name", "Machine Shoulder Press");
    record66.set("equipment", "Machine");
    record66.set("muscleGroup", "Shoulders");
    record66.set("description", "Guided shoulder press machine for controlled movement");
    record66.set("formTips", "Adjust seat, press overhead, full range of motion, controlled descent");
    record66.set("recommendedSetsReps", "3-4 x 10-15 reps");
    record66.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record67.set("name", "Lateral Raises");
    record67.set("equipment", "Dumbbell");
    record67.set("muscleGroup", "Shoulders");
    record67.set("description", "Dumbbell lateral raises for shoulder isolation");
    record67.set("formTips", "Slight bend in elbows, raise to shoulder height, controlled descent");
    record67.set("recommendedSetsReps", "3 x 12-15 reps");
    record67.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record68.set("name", "Front Raises");
    record68.set("equipment", "Dumbbell");
    record68.set("muscleGroup", "Shoulders");
    record68.set("description", "Dumbbell front raises for anterior shoulder development");
    record68.set("formTips", "Slight bend in elbows, raise to shoulder height, controlled descent");
    record68.set("recommendedSetsReps", "3 x 12-15 reps");
    record68.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record69.set("name", "Shrugs - Barbell");
    record69.set("equipment", "Barbell");
    record69.set("muscleGroup", "Shoulders");
    record69.set("description", "Barbell shrugs for trap development");
    record69.set("formTips", "Shrug shoulders to ears, squeeze traps, controlled descent");
    record69.set("recommendedSetsReps", "3-4 x 10-15 reps");
    record69.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record70.set("name", "Shrugs - Dumbbell");
    record70.set("equipment", "Dumbbell");
    record70.set("muscleGroup", "Shoulders");
    record70.set("description", "Dumbbell shrugs for trap isolation");
    record70.set("formTips", "Shrug shoulders to ears, squeeze traps, controlled descent");
    record70.set("recommendedSetsReps", "3-4 x 10-15 reps");
    record70.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record71.set("name", "Pike Push Ups");
    record71.set("equipment", "Bodyweight");
    record71.set("muscleGroup", "Shoulders");
    record71.set("description", "Push ups in pike position for shoulder emphasis");
    record71.set("formTips", "Hips high, head between hands, press overhead, controlled descent");
    record71.set("recommendedSetsReps", "3 x 8-12 reps");
    record71.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record72.set("name", "Upright Rows");
    record72.set("equipment", "Barbell");
    record72.set("muscleGroup", "Shoulders");
    record72.set("description", "Barbell upright rows for shoulder and trap development");
    record72.set("formTips", "Elbows high, pull to chin, squeeze shoulders, controlled descent");
    record72.set("recommendedSetsReps", "3 x 8-12 reps");
    record72.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record73.set("name", "Cable Lateral Raises");
    record73.set("equipment", "Cable");
    record73.set("muscleGroup", "Shoulders");
    record73.set("description", "Cable lateral raises for shoulder isolation");
    record73.set("formTips", "Slight bend in elbows, raise to shoulder height, squeeze delts");
    record73.set("recommendedSetsReps", "3 x 12-15 reps");
    record73.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record74.set("name", "Barbell Squat - Back Squat");
    record74.set("equipment", "Barbell");
    record74.set("muscleGroup", "Legs");
    record74.set("description", "Classic back squat for leg strength");
    record74.set("formTips", "Chest up, knees tracking toes, full depth, drive through heels");
    record74.set("recommendedSetsReps", "3-5 x 5-8 reps");
    record74.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record75.set("name", "Barbell Squat - Front Squat");
    record75.set("equipment", "Barbell");
    record75.set("muscleGroup", "Legs");
    record75.set("description", "Front squat for quad emphasis");
    record75.set("formTips", "Upright torso, elbows high, full depth, drive through heels");
    record75.set("recommendedSetsReps", "3-4 x 6-10 reps");
    record75.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record76.set("name", "Goblet Squat");
    record76.set("equipment", "Dumbbell");
    record76.set("muscleGroup", "Legs");
    record76.set("description", "Dumbbell goblet squat for leg development");
    record76.set("formTips", "Hold dumbbell at chest, full depth, upright torso, drive through heels");
    record76.set("recommendedSetsReps", "3-4 x 10-15 reps");
    record76.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record77.set("name", "Lunges - Forward");
    record77.set("equipment", "Bodyweight");
    record77.set("muscleGroup", "Legs");
    record77.set("description", "Forward lunges for leg strength and balance");
    record77.set("formTips", "Step forward, 90-degree angles, back knee nearly touches ground");
    record77.set("recommendedSetsReps", "3 x 10-12 reps per leg");
    record77.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record78.set("name", "Lunges - Reverse");
    record78.set("equipment", "Bodyweight");
    record78.set("muscleGroup", "Legs");
    record78.set("description", "Reverse lunges for quad and glute development");
    record78.set("formTips", "Step backward, 90-degree angles, front knee tracking toe");
    record78.set("recommendedSetsReps", "3 x 10-12 reps per leg");
    record78.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record79.set("name", "Lunges - Walking");
    record79.set("equipment", "Bodyweight");
    record79.set("muscleGroup", "Legs");
    record79.set("description", "Walking lunges for dynamic leg strength");
    record79.set("formTips", "Continuous movement, 90-degree angles, maintain balance");
    record79.set("recommendedSetsReps", "3 x 20 steps total");
    record79.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record80.set("name", "Lunges - Lateral");
    record80.set("equipment", "Bodyweight");
    record80.set("muscleGroup", "Legs");
    record80.set("description", "Lateral lunges for inner thigh and glute activation");
    record80.set("formTips", "Step to side, weight on stepping leg, opposite leg straight");
    record80.set("recommendedSetsReps", "3 x 10-12 reps per side");
    record80.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record81.set("name", "Bulgarian Split Squats");
    record81.set("equipment", "Bench");
    record81.set("muscleGroup", "Legs");
    record81.set("description", "Single-leg squat with rear foot elevated");
    record81.set("formTips", "Front knee tracking toe, full depth, rear foot elevated on bench");
    record81.set("recommendedSetsReps", "3 x 10-12 reps per leg");
    record81.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record82.set("name", "Leg Press");
    record82.set("equipment", "Machine");
    record82.set("muscleGroup", "Legs");
    record82.set("description", "Machine leg press for quad and glute development");
    record82.set("formTips", "Feet shoulder-width apart, full range of motion, controlled descent");
    record82.set("recommendedSetsReps", "3-4 x 10-15 reps");
    record82.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record83.set("name", "Leg Curls - Machine");
    record83.set("equipment", "Machine");
    record83.set("muscleGroup", "Legs");
    record83.set("description", "Machine leg curls for hamstring isolation");
    record83.set("formTips", "Adjust seat, curl legs, squeeze hamstrings, controlled descent");
    record83.set("recommendedSetsReps", "3-4 x 10-15 reps");
    record83.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record84.set("name", "Leg Curls - Lying");
    record84.set("equipment", "Machine");
    record84.set("muscleGroup", "Legs");
    record84.set("description", "Lying leg curls for hamstring development");
    record84.set("formTips", "Lie face down, curl legs, squeeze hamstrings, controlled descent");
    record84.set("recommendedSetsReps", "3-4 x 10-15 reps");
    record84.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record85.set("name", "Leg Curls - Seated");
    record85.set("equipment", "Machine");
    record85.set("muscleGroup", "Legs");
    record85.set("description", "Seated leg curls for hamstring isolation");
    record85.set("formTips", "Sit upright, curl legs, squeeze hamstrings, controlled descent");
    record85.set("recommendedSetsReps", "3-4 x 10-15 reps");
    record85.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record86.set("name", "Leg Extensions");
    record86.set("equipment", "Machine");
    record86.set("muscleGroup", "Legs");
    record86.set("description", "Machine leg extensions for quad isolation");
    record86.set("formTips", "Adjust seat, extend legs, squeeze quads, controlled descent");
    record86.set("recommendedSetsReps", "3-4 x 10-15 reps");
    record86.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record87.set("name", "Calf Raises - Standing");
    record87.set("equipment", "Machine");
    record87.set("muscleGroup", "Legs");
    record87.set("description", "Standing calf raises for calf development");
    record87.set("formTips", "Rise on toes, squeeze calves, controlled descent, full range of motion");
    record87.set("recommendedSetsReps", "3-4 x 12-20 reps");
    record87.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record88.set("name", "Calf Raises - Seated");
    record88.set("equipment", "Machine");
    record88.set("muscleGroup", "Legs");
    record88.set("description", "Seated calf raises for calf isolation");
    record88.set("formTips", "Sit upright, rise on toes, squeeze calves, controlled descent");
    record88.set("recommendedSetsReps", "3-4 x 12-20 reps");
    record88.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record89.set("name", "Calf Raises - Machine");
    record89.set("equipment", "Machine");
    record89.set("muscleGroup", "Legs");
    record89.set("description", "Machine calf raises for controlled calf workout");
    record89.set("formTips", "Rise on toes, squeeze calves, full range of motion, controlled descent");
    record89.set("recommendedSetsReps", "3-4 x 12-20 reps");
    record89.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record90.set("name", "Deadlifts - Conventional");
    record90.set("equipment", "Barbell");
    record90.set("muscleGroup", "Legs");
    record90.set("description", "Classic deadlift for full-body strength");
    record90.set("formTips", "Neutral spine, shoulders over bar, drive through heels, full lockout");
    record90.set("recommendedSetsReps", "3-5 x 3-6 reps");
    record90.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record91.set("name", "Deadlifts - Sumo");
    record91.set("equipment", "Barbell");
    record91.set("muscleGroup", "Legs");
    record91.set("description", "Sumo deadlift with wide stance for quad emphasis");
    record91.set("formTips", "Wide stance, toes out, upright torso, drive through heels");
    record91.set("recommendedSetsReps", "3-5 x 3-6 reps");
    record91.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record92.set("name", "Deadlifts - Romanian");
    record92.set("equipment", "Barbell");
    record92.set("muscleGroup", "Legs");
    record92.set("description", "Romanian deadlift for hamstring and glute emphasis");
    record92.set("formTips", "Slight knee bend, hip hinge, neutral spine, controlled descent");
    record92.set("recommendedSetsReps", "3-4 x 6-10 reps");
    record92.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record93.set("name", "Hip Thrusts");
    record93.set("equipment", "Bench");
    record93.set("muscleGroup", "Legs");
    record93.set("description", "Hip thrusts for glute development");
    record93.set("formTips", "Shoulders on bench, drive through heels, squeeze glutes at top");
    record93.set("recommendedSetsReps", "3-4 x 10-15 reps");
    record93.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record94.set("name", "Glute Bridges");
    record94.set("equipment", "Bodyweight");
    record94.set("muscleGroup", "Legs");
    record94.set("description", "Glute bridges for glute activation");
    record94.set("formTips", "Feet flat, drive through heels, squeeze glutes, controlled descent");
    record94.set("recommendedSetsReps", "3 x 12-15 reps");
    record94.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record95.set("name", "Step Ups");
    record95.set("equipment", "Bench");
    record95.set("muscleGroup", "Legs");
    record95.set("description", "Step ups for leg strength and balance");
    record95.set("formTips", "Step up with control, full extension, alternate legs");
    record95.set("recommendedSetsReps", "3 x 10-12 reps per leg");
    record95.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record96.set("name", "Wall Sits");
    record96.set("equipment", "Bodyweight");
    record96.set("muscleGroup", "Legs");
    record96.set("description", "Isometric quad exercise against wall");
    record96.set("formTips", "Back against wall, 90-degree angles, engage quads");
    record96.set("recommendedSetsReps", "3 x 30-60 seconds");
    record96.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record97.set("name", "Bicep Curls - Dumbbell");
    record97.set("equipment", "Dumbbell");
    record97.set("muscleGroup", "Arms");
    record97.set("description", "Dumbbell bicep curls for arm development");
    record97.set("formTips", "Elbows at sides, full range of motion, controlled descent");
    record97.set("recommendedSetsReps", "3-4 x 8-12 reps");
    record97.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record98.set("name", "Bicep Curls - Barbell");
    record98.set("equipment", "Barbell");
    record98.set("muscleGroup", "Arms");
    record98.set("description", "Barbell bicep curls for strength");
    record98.set("formTips", "Elbows at sides, full range of motion, controlled descent");
    record98.set("recommendedSetsReps", "3-4 x 6-10 reps");
    record98.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record99.set("name", "Bicep Curls - Machine");
    record99.set("equipment", "Machine");
    record99.set("muscleGroup", "Arms");
    record99.set("description", "Machine bicep curls for controlled movement");
    record99.set("formTips", "Adjust seat, full range of motion, squeeze biceps, controlled descent");
    record99.set("recommendedSetsReps", "3-4 x 10-15 reps");
    record99.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record100.set("name", "Bicep Curls - Cable");
    record100.set("equipment", "Cable");
    record100.set("muscleGroup", "Arms");
    record100.set("description", "Cable bicep curls for constant tension");
    record100.set("formTips", "Elbows at sides, full range of motion, squeeze biceps");
    record100.set("recommendedSetsReps", "3-4 x 10-15 reps");
    record100.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record101.set("name", "Hammer Curls");
    record101.set("equipment", "Dumbbell");
    record101.set("muscleGroup", "Arms");
    record101.set("description", "Hammer curls for bicep and brachialis development");
    record101.set("formTips", "Neutral grip, elbows at sides, full range of motion");
    record101.set("recommendedSetsReps", "3-4 x 8-12 reps");
    record101.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record102.set("name", "Preacher Curls");
    record102.set("equipment", "Bench");
    record102.set("muscleGroup", "Arms");
    record102.set("description", "Preacher curls for isolated bicep work");
    record102.set("formTips", "Arms on preacher bench, full range of motion, controlled descent");
    record102.set("recommendedSetsReps", "3-4 x 8-12 reps");
    record102.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record103.set("name", "Concentration Curls");
    record103.set("equipment", "Dumbbell");
    record103.set("muscleGroup", "Arms");
    record103.set("description", "Concentration curls for bicep isolation");
    record103.set("formTips", "Elbow on knee, full range of motion, squeeze at top");
    record103.set("recommendedSetsReps", "3 x 10-12 reps per arm");
    record103.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record104.set("name", "Tricep Dips - Bench");
    record104.set("equipment", "Bench");
    record104.set("muscleGroup", "Arms");
    record104.set("description", "Bench dips for tricep development");
    record104.set("formTips", "Hands on bench, body straight, lower until 90 degrees");
    record104.set("recommendedSetsReps", "3 x 8-12 reps");
    record104.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record105.set("name", "Tricep Dips - Machine");
    record105.set("equipment", "Machine");
    record105.set("muscleGroup", "Arms");
    record105.set("description", "Machine tricep dips for controlled movement");
    record105.set("formTips", "Adjust seat, full range of motion, squeeze triceps");
    record105.set("recommendedSetsReps", "3-4 x 10-15 reps");
    record105.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record106.set("name", "Overhead Tricep Extension");
    record106.set("equipment", "Dumbbell");
    record106.set("muscleGroup", "Arms");
    record106.set("description", "Overhead tricep extension for tricep isolation");
    record106.set("formTips", "Dumbbell overhead, elbows stationary, full range of motion");
    record106.set("recommendedSetsReps", "3-4 x 10-12 reps");
    record106.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record107.set("name", "Tricep Pushdowns - Rope");
    record107.set("equipment", "Cable");
    record107.set("muscleGroup", "Arms");
    record107.set("description", "Cable tricep pushdowns with rope attachment");
    record107.set("formTips", "Elbows at sides, push down, squeeze triceps, controlled return");
    record107.set("recommendedSetsReps", "3-4 x 12-15 reps");
    record107.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record108.set("name", "Tricep Pushdowns - Bar");
    record108.set("equipment", "Cable");
    record108.set("muscleGroup", "Arms");
    record108.set("description", "Cable tricep pushdowns with straight bar");
    record108.set("formTips", "Elbows at sides, push down, squeeze triceps, controlled return");
    record108.set("recommendedSetsReps", "3-4 x 12-15 reps");
    record108.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record109.set("name", "Skull Crushers");
    record109.set("equipment", "Barbell");
    record109.set("muscleGroup", "Arms");
    record109.set("description", "Skull crushers for tricep development");
    record109.set("formTips", "Elbows stationary, lower to forehead, full extension");
    record109.set("recommendedSetsReps", "3-4 x 8-12 reps");
    record109.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record110.set("name", "Close Grip Push Ups");
    record110.set("equipment", "Bodyweight");
    record110.set("muscleGroup", "Arms");
    record110.set("description", "Push ups with close grip for tricep emphasis");
    record110.set("formTips", "Hands close together, elbows tucked, full range of motion");
    record110.set("recommendedSetsReps", "3 x 8-12 reps");
    record110.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record111.set("name", "Resistance Band Curls");
    record111.set("equipment", "Bands");
    record111.set("muscleGroup", "Arms");
    record111.set("description", "Resistance band bicep curls");
    record111.set("formTips", "Stand on band, curl up, squeeze biceps, controlled descent");
    record111.set("recommendedSetsReps", "3 x 12-15 reps");
    record111.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record112.set("name", "Plank - Standard");
    record112.set("equipment", "Bodyweight");
    record112.set("muscleGroup", "Abs-Core");
    record112.set("description", "Classic plank for core stability");
    record112.set("formTips", "Straight body line, engage core, shoulders over wrists");
    record112.set("recommendedSetsReps", "3 x 30-60 seconds");
    record112.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record113.set("name", "Plank - Side");
    record113.set("equipment", "Bodyweight");
    record113.set("muscleGroup", "Abs-Core");
    record113.set("description", "Side plank for oblique and core strength");
    record113.set("formTips", "Straight body line, engage obliques, shoulders over wrist");
    record113.set("recommendedSetsReps", "3 x 20-45 seconds per side");
    record113.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record114.set("name", "Plank - Dynamic");
    record114.set("equipment", "Bodyweight");
    record114.set("muscleGroup", "Abs-Core");
    record114.set("description", "Dynamic plank with movement for core engagement");
    record114.set("formTips", "Maintain plank position, controlled movements, engage core");
    record114.set("recommendedSetsReps", "3 x 30-45 seconds");
    record114.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record115.set("name", "Crunches - Machine");
    record115.set("equipment", "Machine");
    record115.set("muscleGroup", "Abs-Core");
    record115.set("description", "Machine crunches for ab isolation");
    record115.set("formTips", "Adjust seat, full range of motion, squeeze abs, controlled descent");
    record115.set("recommendedSetsReps", "3-4 x 12-15 reps");
    record115.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record116.set("name", "Crunches - Floor");
    record116.set("equipment", "Bodyweight");
    record116.set("muscleGroup", "Abs-Core");
    record116.set("description", "Floor crunches for ab development");
    record116.set("formTips", "Hands behind head, lift shoulders, squeeze abs, controlled descent");
    record116.set("recommendedSetsReps", "3 x 15-20 reps");
    record116.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record117.set("name", "Crunches - Cable");
    record117.set("equipment", "Cable");
    record117.set("muscleGroup", "Abs-Core");
    record117.set("description", "Cable crunches for ab isolation");
    record117.set("formTips", "Kneel facing machine, crunch down, squeeze abs, controlled return");
    record117.set("recommendedSetsReps", "3 x 12-15 reps");
    record117.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record118.set("name", "Leg Raises - Hanging");
    record118.set("equipment", "Pull-up Bar");
    record118.set("muscleGroup", "Abs-Core");
    record118.set("description", "Hanging leg raises for lower ab development");
    record118.set("formTips", "Hang from bar, raise legs, controlled descent, avoid swinging");
    record118.set("recommendedSetsReps", "3 x 8-12 reps");
    record118.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record119.set("name", "Leg Raises - Lying");
    record119.set("equipment", "Bench");
    record119.set("muscleGroup", "Abs-Core");
    record119.set("description", "Lying leg raises for lower ab isolation");
    record119.set("formTips", "Lie on back, raise legs, controlled descent, lower back on bench");
    record119.set("recommendedSetsReps", "3 x 10-15 reps");
    record119.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record120.set("name", "Leg Raises - Machine");
    record120.set("equipment", "Machine");
    record120.set("muscleGroup", "Abs-Core");
    record120.set("description", "Machine leg raises for controlled ab work");
    record120.set("formTips", "Adjust seat, raise legs, squeeze abs, controlled descent");
    record120.set("recommendedSetsReps", "3-4 x 12-15 reps");
    record120.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record121.set("equipment", "Bodyweight");
    record121.set("muscleGroup", "Abs-Core");
    record121.set("description", "Russian twists for oblique development");
    record121.set("formTips", "Sit with knees bent, rotate torso, touch ground on sides");
    record121.set("recommendedSetsReps", "3 x 20-30 reps total");
    record121.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record122.set("name", "Ab Wheel Rollouts");
    record122.set("equipment", "Bodyweight");
    record122.set("muscleGroup", "Abs-Core");
    record122.set("description", "Ab wheel rollouts for core strength");
    record122.set("formTips", "Kneel, roll forward, maintain straight body, controlled return");
    record122.set("recommendedSetsReps", "3 x 8-12 reps");
    record122.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record123.set("name", "Pallof Press");
    record123.set("equipment", "Cable");
    record123.set("muscleGroup", "Abs-Core");
    record123.set("description", "Pallof press for anti-rotation core strength");
    record123.set("formTips", "Stand perpendicular to cable, press away, resist rotation");
    record123.set("recommendedSetsReps", "3 x 10-12 reps per side");
    record123.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record124.set("name", "Dead Bugs");
    record124.set("equipment", "Bodyweight");
    record124.set("muscleGroup", "Abs-Core");
    record124.set("description", "Dead bugs for core stability");
    record124.set("formTips", "Lie on back, extend opposite arm and leg, controlled movement");
    record124.set("recommendedSetsReps", "3 x 10-12 reps per side");
    record124.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record125.set("name", "Bird Dogs");
    record125.set("equipment", "Bodyweight");
    record125.set("muscleGroup", "Abs-Core");
    record125.set("description", "Bird dogs for core and glute activation");
    record125.set("formTips", "Hands and knees, extend opposite arm and leg, controlled movement");
    record125.set("recommendedSetsReps", "3 x 10-12 reps per side");
    record125.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record126.set("name", "Hollow Body Hold");
    record126.set("equipment", "Bodyweight");
    record126.set("muscleGroup", "Abs-Core");
    record126.set("description", "Hollow body hold for core strength");
    record126.set("formTips", "Lie on back, arms overhead, body in hollow position, engage core");
    record126.set("recommendedSetsReps", "3 x 20-45 seconds");
    record126.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record127.set("name", "Decline Sit Ups");
    record127.set("equipment", "Bench");
    record127.set("muscleGroup", "Abs-Core");
    record127.set("description", "Sit ups on declined bench for ab development");
    record127.set("formTips", "Feet secured, full range of motion, controlled descent");
    record127.set("recommendedSetsReps", "3 x 10-15 reps");
    record127.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record128.set("name", "Stretching - Hamstring");
    record128.set("equipment", "Bodyweight");
    record128.set("muscleGroup", "Flexibility");
    record128.set("description", "Hamstring stretching for flexibility");
    record128.set("formTips", "Reach toward toes, hold stretch, breathe deeply");
    record128.set("recommendedSetsReps", "3 x 30-60 seconds per leg");
    record128.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record129.set("name", "Stretching - Quad");
    record129.set("equipment", "Bodyweight");
    record129.set("muscleGroup", "Flexibility");
    record129.set("description", "Quad stretching for flexibility");
    record129.set("formTips", "Pull foot to glute, keep knees together, hold stretch");
    record129.set("recommendedSetsReps", "3 x 30-60 seconds per leg");
    record129.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record130.set("name", "Stretching - Hip");
    record130.set("equipment", "Bodyweight");
    record130.set("muscleGroup", "Flexibility");
    record130.set("description", "Hip stretching for mobility");
    record130.set("formTips", "Cross leg over body, pull toward chest, hold stretch");
    record130.set("recommendedSetsReps", "3 x 30-60 seconds per side");
    record130.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record131.set("name", "Stretching - Shoulder");
    record131.set("equipment", "Bodyweight");
    record131.set("muscleGroup", "Flexibility");
    record131.set("description", "Shoulder stretching for mobility");
    record131.set("formTips", "Cross arm over body, pull toward chest, hold stretch");
    record131.set("recommendedSetsReps", "3 x 30-60 seconds per side");
    record131.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record132.set("name", "Stretching - Back");
    record132.set("equipment", "Bodyweight");
    record132.set("muscleGroup", "Flexibility");
    record132.set("description", "Back stretching for flexibility");
    record132.set("formTips", "Hug knees to chest, round spine, hold stretch");
    record132.set("recommendedSetsReps", "3 x 30-60 seconds");
    record132.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record133.set("name", "Yoga - Downward Dog");
    record133.set("equipment", "Bodyweight");
    record133.set("muscleGroup", "Flexibility");
    record133.set("description", "Downward dog yoga pose for full-body stretch");
    record133.set("formTips", "Hands and feet on ground, hips high, head between arms");
    record133.set("recommendedSetsReps", "3 x 30-60 seconds");
    record133.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record134.set("name", "Yoga - Warrior Pose I");
    record134.set("equipment", "Bodyweight");
    record134.set("muscleGroup", "Flexibility");
    record134.set("description", "Warrior pose I for balance and strength");
    record134.set("formTips", "Front knee bent, back foot grounded, arms overhead");
    record134.set("recommendedSetsReps", "3 x 30-45 seconds per side");
    record134.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record135.set("name", "Yoga - Warrior Pose II");
    record135.set("equipment", "Bodyweight");
    record135.set("muscleGroup", "Flexibility");
    record135.set("description", "Warrior pose II for balance and leg strength");
    record135.set("formTips", "Front knee bent, arms extended, gaze forward");
    record135.set("recommendedSetsReps", "3 x 30-45 seconds per side");
    record135.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record136.set("name", "Yoga - Child's Pose");
    record136.set("equipment", "Bodyweight");
    record136.set("muscleGroup", "Flexibility");
    record136.set("description", "Child's pose for relaxation and stretching");
    record136.set("formTips", "Knees wide, hips to heels, arms extended, breathe deeply");
    record136.set("recommendedSetsReps", "3 x 30-60 seconds");
    record136.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record137.set("name", "Foam Rolling - Quads");
    record137.set("equipment", "Bodyweight");
    record137.set("muscleGroup", "Flexibility");
    record137.set("description", "Foam rolling for quad recovery");
    record137.set("formTips", "Roll slowly, pause on tender spots, breathe deeply");
    record137.set("recommendedSetsReps", "2-3 minutes per leg");
    record137.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record138.set("name", "Foam Rolling - Back");
    record138.set("equipment", "Bodyweight");
    record138.set("muscleGroup", "Flexibility");
    record138.set("description", "Foam rolling for back recovery");
    record138.set("formTips", "Roll slowly, avoid rolling on spine, pause on tender spots");
    record138.set("recommendedSetsReps", "2-3 minutes");
    record138.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record139.set("name", "Mobility Drills - Hip Circles");
    record139.set("equipment", "Bodyweight");
    record139.set("muscleGroup", "Flexibility");
    record139.set("description", "Hip mobility drills for range of motion");
    record139.set("formTips", "Hands on hips, make large circles, controlled movement");
    record139.set("recommendedSetsReps", "3 x 10 circles each direction");
    record139.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record140.set("name", "Dynamic Stretching - Leg Swings");
    record140.set("equipment", "Bodyweight");
    record140.set("muscleGroup", "Flexibility");
    record140.set("description", "Dynamic leg swings for mobility");
    record140.set("formTips", "Controlled swings, gradually increase range, maintain balance");
    record140.set("recommendedSetsReps", "3 x 10-15 swings per direction");
    record140.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record141.set("name", "Kettlebell Swings");
    record141.set("equipment", "Kettlebell");
    record141.set("muscleGroup", "Full Body");
    record141.set("description", "Kettlebell swings for power and cardio");
    record141.set("formTips", "Hip hinge, explosive hip drive, controlled swing");
    record141.set("recommendedSetsReps", "3-4 x 15-20 reps");
    record141.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record142.set("name", "Clean and Press");
    record142.set("equipment", "Barbell");
    record142.set("muscleGroup", "Full Body");
    record142.set("description", "Clean and press for full-body strength and power");
    record142.set("formTips", "Explosive clean, stable rack position, press overhead");
    record142.set("recommendedSetsReps", "3-5 x 3-5 reps");
    record142.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record143.set("name", "Thrusters");
    record143.set("equipment", "Barbell");
    record143.set("muscleGroup", "Full Body");
    record143.set("description", "Thrusters combining squat and press");
    record143.set("formTips", "Full squat depth, explosive press, controlled descent");
    record143.set("recommendedSetsReps", "3-4 x 8-12 reps");
    record143.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record144.set("name", "Turkish Get Ups");
    record144.set("equipment", "Kettlebell");
    record144.set("muscleGroup", "Full Body");
    record144.set("description", "Turkish get ups for full-body strength and mobility");
    record144.set("formTips", "Controlled movement, eyes on weight, full range of motion");
    record144.set("recommendedSetsReps", "3 x 5 reps per side");
    record144.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record145.set("name", "Farmer Carries");
    record145.set("equipment", "Dumbbell");
    record145.set("muscleGroup", "Full Body");
    record145.set("description", "Farmer carries for grip and core strength");
    record145.set("formTips", "Upright posture, engage core, controlled walking");
    record145.set("recommendedSetsReps", "3 x 40-60 meters");
    record145.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record146.set("name", "Sled Push");
    record146.set("equipment", "Machine");
    record146.set("muscleGroup", "Full Body");
    record146.set("description", "Sled push for leg and core strength");
    record146.set("formTips", "Upright posture, explosive push, controlled pace");
    record146.set("recommendedSetsReps", "3-4 x 30-50 meters");
    record146.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record147.set("name", "Sled Pull");
    record147.set("equipment", "Machine");
    record147.set("muscleGroup", "Full Body");
    record147.set("description", "Sled pull for leg and back strength");
    record147.set("formTips", "Controlled pull, maintain posture, steady pace");
    record147.set("recommendedSetsReps", "3-4 x 30-50 meters");
    record147.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record148.set("name", "Battle Ropes");
    record148.set("equipment", "Cardio Equipment");
    record148.set("muscleGroup", "Full Body");
    record148.set("description", "Battle ropes for cardio and upper body power");
    record148.set("formTips", "Explosive arm movements, engage core, maintain rhythm");
    record148.set("recommendedSetsReps", "3-4 x 30-45 seconds");
    record148.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record149.set("name", "Medicine Ball Slams");
    record149.set("equipment", "Bodyweight");
    record149.set("muscleGroup", "Full Body");
    record149.set("description", "Medicine ball slams for power and cardio");
    record149.set("formTips", "Explosive slam, full body engagement, controlled catch");
    record149.set("recommendedSetsReps", "3 x 10-15 reps");
    record149.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
    record150.set("name", "Medicine Ball Chest Pass");
    record150.set("equipment", "Bodyweight");
    record150.set("muscleGroup", "Chest");
    record150.set("description", "Medicine ball chest pass for explosive power");
    record150.set("formTips", "Explosive pass, catch with control, full range of motion");
    record150.set("recommendedSetsReps", "3 x 10-12 reps");
    record150.set("videoUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
  try {
    app.save(record150);
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
