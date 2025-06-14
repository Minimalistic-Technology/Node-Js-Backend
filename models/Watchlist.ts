import mongoose, { Schema, Document, Model } from 'mongoose';

export interface WatchlistDocument extends Document {
  name: string;
  itemCount: number;
}

const WatchlistSchema = new Schema<WatchlistDocument>({
  name: { type: String, required: true },
  itemCount: { type: Number, default: 0 },
});

const WatchlistModel: Model<WatchlistDocument> =
  mongoose.models.Watchlist || mongoose.model<WatchlistDocument>('Watchlist', WatchlistSchema);

export default WatchlistModel;
