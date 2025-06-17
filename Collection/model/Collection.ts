import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for a Collection document
export interface ICollection extends Document {
  name?: string;
  icon?: string;
}

// Define the schema
const CollectionSchema: Schema = new Schema<ICollection>({
  name: { type: String },
  icon: { type: String },
});

// Export the model
const Collection = mongoose.model<ICollection>('Collection', CollectionSchema);
export default Collection;
