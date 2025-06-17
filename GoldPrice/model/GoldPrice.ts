import { Schema, model, Document } from 'mongoose';

export interface IGoldPrice extends Document {
  date: string;
  price: number;
}

const goldPriceSchema = new Schema<IGoldPrice>({
  date: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

export default model<IGoldPrice>('GoldPrice', goldPriceSchema);
