import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITopSector extends Document {
  name: string;
  count: number;
}

const topSectorsSchema: Schema<ITopSector> = new Schema({
  name: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  }
});

const TopSectors: Model<ITopSector> = 
  mongoose.models.TopSectors || mongoose.model<ITopSector>('TopSectors', topSectorsSchema);

export default TopSectors;
