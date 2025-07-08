import mongoose, { Schema, Document } from "mongoose";

export interface ITeamMember extends Document {
  name: string;
  position: string;
  img: string;
}

const TeamSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    img: { type: String, required: true },
  },
  { timestamps: true }
);

export const TeamModel = mongoose.models.Team || mongoose.model<ITeamMember>("Team", TeamSchema);
