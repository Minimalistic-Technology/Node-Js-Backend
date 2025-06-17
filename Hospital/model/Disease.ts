import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IDisease extends Document {
  alphabet: Types.ObjectId;
  name: string;
  see?: string | null;
}

const diseaseSchema: Schema = new Schema<IDisease>({
  alphabet: {
    type: Schema.Types.ObjectId,
    ref: 'Alphabet',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  see: {
    type: String,
    default: null
  }
});

export default mongoose.model<IDisease>('Disease', diseaseSchema);
