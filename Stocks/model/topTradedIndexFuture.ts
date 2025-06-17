import mongoose, { Schema, Document, Model } from 'mongoose';

export interface TopTradedIndexFutureDocument extends Document {
  name: string;
  icon: string;
  lasttraded: string;
  daychange: string;
}

const TopTradedIndexFutureSchema = new Schema<TopTradedIndexFutureDocument>({
  name: { type: String },
  icon: { type: String },
  lasttraded: { type: String },
  daychange: { type: String },
});

const TopTradedIndexFutureModel: Model<TopTradedIndexFutureDocument> =
  mongoose.models.TopTradedIndexFuture ||
  mongoose.model<TopTradedIndexFutureDocument>('TopTradedIndexFuture', TopTradedIndexFutureSchema);

export default TopTradedIndexFutureModel;
