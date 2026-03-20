import Schedule from "../models/Schedule.js";

export const createSchedule = async (req, res) => {
  const data = await Schedule.create(req.body);
  res.json(data);
};

export const getSchedule = async (req, res) => {
  const data = await Schedule.find();
  res.json(data);
};