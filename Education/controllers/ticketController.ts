import { Request, Response } from "express";
import { TicketModel } from "../models/ticket";

export const createTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticket = new TicketModel(req.body);
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ error: "Failed to create ticket" });
  }
};

export const getAllTickets = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tickets = await TicketModel.find();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: "Failed to get tickets" });
  }
};

export const getTicketById = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticket = await TicketModel.findById(req.params.id);
    if (!ticket)  res.status(404).json({ error: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: "Failed to get ticket" });
  }
};

export const updateTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await TicketModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)  res.status(404).json({ error: "Ticket not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update ticket" });
  }
};

export const deleteTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await TicketModel.findByIdAndDelete(req.params.id);
    if (!deleted)  res.status(404).json({ error: "Ticket not found" });
    res.json({ message: "Ticket deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete ticket" });
  }
};

export const addResponseToTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticket = await TicketModel.findById(req.params.id);
    if (!ticket) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }
    
    ticket.responses.push(req.body);
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ error: "Failed to add response" });
  }
};
