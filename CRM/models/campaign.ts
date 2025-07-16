import mongoose, { Schema, Document } from 'mongoose';

export interface ICampaign extends Document {
  name: string;
  type: string;
  status: string;
  budget: string;
  expectedRevenue: string;
  actualRevenue: string; 
  startDate: Date;
  endDate: Date;
}

const CampaignSchema = new Schema<ICampaign>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    budget: { type: String, required: true },
    expectedRevenue: { type: String, required: true },
    actualRevenue: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export const CampaignModel = mongoose.models.Campaign || mongoose.model<ICampaign>('Campaign', CampaignSchema);
