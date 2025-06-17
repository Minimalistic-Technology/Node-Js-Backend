import mongoose, { Schema, Document, Model } from 'mongoose';

export interface TopSectorsDocument extends Document {
  name: string;
  count: number;
}

const TopSectorsSchema: Schema<TopSectorsDocument> = new Schema({
  name: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

const TopSectors: Model<TopSectorsDocument> =
  mongoose.models.TopSectors || mongoose.model<TopSectorsDocument>('TopSectors', TopSectorsSchema);

export default TopSectors;
