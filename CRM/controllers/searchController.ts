import { Request, Response } from "express";
import { ContactModel } from "../models/Registercontact";
import { AccountModel } from "../models/account";
import { CampaignModel } from "../models/campaign";
import { LeadModel } from "../models/lead";
import { MeetingModel } from "../models/meeting";
import { DealModel } from "../models/deal";
import { TaskModel } from "../models/task";
import { Model } from "mongoose";

export const handleSearch = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;

  if (!query || typeof query !== "string") {
    res.status(400).json({ message: "Query is required" });
    return;
  }

  try {
    const regexQuery = { $regex: query, $options: "i" };

    const searchOrder: {
      model: Model<any>;
      field: string | string[];
      type: string;
    }[] = [
      { model: ContactModel, field: "name", type: "contacts" },
      { model: AccountModel, field: "name", type: "accounts" },
      { model: CampaignModel, field: "name", type: "campaigns" },
      { model: LeadModel, field: ["firstName", "lastName"], type: "leads" },
      { model: MeetingModel, field: "name", type: "meetings" },
      { model: TaskModel, field: "subject", type: "tasks" },
      { model: DealModel, field: "name", type: "deals" }
    ];

    for (const { model, field, type } of searchOrder) {
      const condition =
        Array.isArray(field)
          ? { $or: field.map(f => ({ [f]: regexQuery })) }
          : { [field]: regexQuery };

      const match = await model.findOne(condition);
      if (match) {
        res.json({ match: type, id: match._id });
        return;
      }
    }

    res.status(404).json({ message: "No match found" });

  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
