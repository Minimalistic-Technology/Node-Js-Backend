import mongoose, { Schema, Document, Model } from 'mongoose';

export interface MostTradedDocument extends Document {
  name: string;
  icon: string;
  lasttraded: string;
  daychange: string;
}

const tradedSchema = new Schema<MostTradedDocument>({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  lasttraded: { type: String, required: true },
  daychange: { type: String, required: true },
});

const MostTradedModel: Model<MostTradedDocument> =
  mongoose.models.MostTraded || mongoose.model<MostTradedDocument>('MostTraded', tradedSchema);

export default MostTradedModel;
