import mongoose from "mongoose";
import dotenv from "dotenv";
import Schedule from "./src/models/Schedule.js";

dotenv.config();

const scheduleData = [
  // Day 1
  {
    title: "Inauguration",
    description: "Event kickoff and opening ceremony",
    date: "2026-03-20",
    start_time: "16:30",
    end_time: "17:30",
    venue: "Main Auditorium",
    type: "ceremony",
    day: 1
  },
  {
    title: "Lecture",
    description: "Introduction to DART 2K26 themes",
    date: "2026-03-20",
    start_time: "17:30",
    end_time: "19:30",
    venue: "Lecture Hall 1",
    type: "workshop",
    day: 1
  },
  // Day 2
  {
    title: "Hands on training",
    description: "Morning practical session",
    date: "2026-03-21",
    start_time: "09:00",
    end_time: "12:00",
    venue: "Lab A",
    type: "workshop",
    day: 2
  },
  {
    title: "Hands on training",
    description: "Afternoon practical session",
    date: "2026-03-21",
    start_time: "13:00",
    end_time: "16:30",
    venue: "Lab A",
    type: "workshop",
    day: 2
  },
  {
    title: "Hands on training",
    description: "Evening practical session",
    date: "2026-03-21",
    start_time: "17:15",
    end_time: "19:30",
    venue: "Lab A",
    type: "workshop",
    day: 2
  },
  // Day 3
  {
    title: "Hands on training",
    description: "Morning practical session",
    date: "2026-03-22",
    start_time: "09:00",
    end_time: "12:00",
    venue: "Lab B",
    type: "workshop",
    day: 3
  },
  {
    title: "Hands on training",
    description: "Afternoon practical session",
    date: "2026-03-22",
    start_time: "13:00",
    end_time: "16:30",
    venue: "Lab B",
    type: "workshop",
    day: 3
  },
  {
    title: "Hands on training",
    description: "Evening practical session",
    date: "2026-03-22",
    start_time: "17:15",
    end_time: "19:30",
    venue: "Lab B",
    type: "workshop",
    day: 3
  },
  // Day 4
  {
    title: "Hands on training (Tech Team)",
    description: "Specialized training for the technical team",
    date: "2026-03-23",
    start_time: "16:30",
    end_time: "19:30",
    venue: "Tech Lab",
    type: "workshop",
    day: 4
  },
  // Day 5
  {
    title: "Hands on training (Tech Team)",
    description: "Specialized training for the technical team",
    date: "2026-03-24",
    start_time: "16:30",
    end_time: "19:30",
    venue: "Tech Lab",
    type: "workshop",
    day: 5
  },
  // Day 6
  {
    title: "Competition",
    description: "Main event competition begins",
    date: "2026-03-25",
    start_time: "16:30",
    end_time: "19:30",
    venue: "Main Hall",
    type: "competition",
    day: 6
  },
  // Day 7
  {
    title: "Competition and Closing",
    description: "Finals followed by the awards ceremony",
    date: "2026-03-26",
    start_time: "16:30",
    end_time: "19:30",
    venue: "Main Hall",
    type: "ceremony",
    day: 7
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Schedule.deleteMany({});
    console.log("Cleared existing schedule");

    await Schedule.insertMany(scheduleData);
    console.log("Inserted new schedule");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
