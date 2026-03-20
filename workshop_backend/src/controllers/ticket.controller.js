import Ticket from "../models/Ticket.js";

export const createTicket = async (req, res) => {
  const ticket = await Ticket.create({
    student_id:  req.user.id,
    student_name: req.body.name || "Unknown Student",
    title:       req.body.title,
    description: req.body.description,
    status:      "open",
  });
  
  // Format the output to match what the frontend expects
  res.json({ ...ticket.toJSON(), id: ticket._id.toString() });
};

export const getAllTickets = async (req, res) => {
  // Since student is no longer an ObjectId reference, we just fetch directly
  const tickets = await Ticket.find().lean();
  res.json(tickets.map((t) => ({
    ...t,
    id:          t._id.toString(),
  })));
};

export const updateTicketStatus = async (req, res) => {
  const ticket = await Ticket.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(ticket);
};