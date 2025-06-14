import mongoose, { Schema, Document, Model } from 'mongoose';

export interface InvestmentDocument extends Document {
  totalReturns: number;
  value: number;
}

const InvestmentSchema = new Schema<InvestmentDocument>({
  totalReturns: { type: Number, required: true },
  value: { type: Number, required: true },
});

const InvestmentModel: Model<InvestmentDocument> =
  mongoose.models.Investment || mongoose.model<InvestmentDocument>('Investment', InvestmentSchema);

export default InvestmentModel;
