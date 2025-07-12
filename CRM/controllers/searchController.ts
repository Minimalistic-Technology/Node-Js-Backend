import { Request, Response } from "express";
import { ContactModel } from "../models/registercontact";
import { AccountModel } from "../models/account";
import { CampaignModel } from "../models/campaign";
import { LeadModel } from "../models/lead";
import { MeetingModel } from "../models/meeting";
import { DealModel } from "../models/deal";
import { TaskModel } from "../models/task";

export const handleSearch = async (req: Request, res: Response) => {
  const { query } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ message: "Query is required" });
  }

  try {
    // Search in Contacts (by name)
    const contact = await ContactModel.findOne({ name: { $regex: query, $options: "i" } });
    if (contact) return res.json({ match: "contacts", id: contact._id });

    // Search in Accounts (by name)
    const account = await AccountModel.findOne({ name: { $regex: query, $options: "i" } });
    if (account) return res.json({ match: "accounts", id: account._id });

    // Search in Campaigns (by name)
    const campaign = await CampaignModel.findOne({ name: { $regex: query, $options: "i" } });
    if (campaign) return res.json({ match: "campaigns", id: campaign._id });

    // Search in Leads (by firstName or lastName)
    const lead = await LeadModel.findOne({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } }
      ]
    });
    if (lead) return res.json({ match: "leads", id: lead._id });

    // Search in Meetings (by name)
    const meeting = await MeetingModel.findOne({ name: { $regex: query, $options: "i" } });
    if (meeting) return res.json({ match: "meetings", id: meeting._id });

    // Search in Tasks (by subject)
    const task = await TaskModel.findOne({ subject: { $regex: query, $options: "i" } });
    if (task) return res.json({ match: "tasks", id: task._id });

    // Search in Deals (by name)
    const deal = await DealModel.findOne({ name: { $regex: query, $options: "i" } });
    if (deal) return res.json({ match: "deals", id: deal._id });

    // If nothing matches
    return res.status(404).json({ message: "No match found" });

  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
