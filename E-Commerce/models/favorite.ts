import mongoose, { Document, Schema } from 'mongoose';

export interface IFavorite extends Document {
  userId: string;
  productId: string;
  productName: string;
  productImage: string;
  isFavorite: boolean;
}

const favoriteSchema = new Schema<IFavorite>({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productImage: { type: String, required: true },
  isFavorite: { type: Boolean, default: true }
}, { timestamps: true });

export const FavoriteModel = mongoose.model<IFavorite>('Favorite', favoriteSchema);
