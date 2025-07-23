import { Request, Response } from "express";
import { LeadModel } from "../models/lead";
import { NotificationModel } from "../models/notification";

// Create Lead
export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = new LeadModel(req.body);
    await lead.save();

    await NotificationModel.create({
      userId: req.body.leadOwner || "system",
      message: `Lead "${lead.firstName} ${lead.lastName}" created.`,
      type: "lead",
    });

    res.status(201).json(lead);
  } catch (err) {
    console.error("Create Lead Error:", err);
    res.status(400).json({ error: "Failed to create lead" });
  }
};

// Get All Leads
export const getAllLeads = async (_req: Request, res: Response): Promise<void> => {
  try {
    const leads = await LeadModel.find();
    res.status(200).json(leads);
  } catch (err) {
    console.error("Fetch Leads Error:", err);
    res.status(500).json({ error: "Failed to fetch leads" });
  }
};

// Get Lead by ID
export const getLeadById = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await LeadModel.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }
    res.status(200).json(lead);
  } catch (err) {
    console.error("Fetch Lead Error:", err);
    res.status(500).json({ error: "Failed to get lead" });
  }
};

// Update Lead
export const updateLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await LeadModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }

    await NotificationModel.create({
      userId: req.body.leadOwner || "system",
      message: `Lead "${updated.firstName} ${updated.lastName}" updated.`,
      type: "lead",
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error("Update Lead Error:", err);
    res.status(400).json({ error: "Failed to update lead" });
  }
};

// Delete Lead
export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await LeadModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }

    await NotificationModel.create({
      userId: "system",
      message: `Lead "${deleted.firstName} ${deleted.lastName}" deleted.`,
      type: "lead",
    });

    res.status(200).json({ message: "Lead deleted" });
  } catch (err) {
    console.error("Delete Lead Error:", err);
    res.status(400).json({ error: "Failed to delete lead" });
  }
};
