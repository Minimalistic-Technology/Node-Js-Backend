import mongoose, { Document, Schema, Types } from 'mongoose';
import { AlphabetDocument } from './alphabet'; // Ensure path is correct

// Interface for Disease document
export interface DiseaseDocument extends Document {
  alphabet: Types.ObjectId | AlphabetDocument;
  name: string;
  see?: string | null;
}

// Schema definition
const diseaseSchema: Schema<DiseaseDocument> = new Schema({
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

// Model export
export const Disease = mongoose.model<DiseaseDocument>('Disease', diseaseSchema);
