import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  sender: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: String,
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
    status: { type: String, enum: ["Open", "In Progress", "Closed"], default: "Open" },
    responses: [responseSchema],
  },
  { timestamps: true }
);

export const TicketModel = mongoose.model("Ticket", ticketSchema);
