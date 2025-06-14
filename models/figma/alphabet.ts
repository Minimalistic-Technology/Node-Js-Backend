import mongoose, { Document, Schema } from 'mongoose';

// Define valid alphabet characters (excluding 'Q')
const validAlphabets = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U',
  'V', 'W', 'X', 'Y', 'Z', '#'
];

// Interface for type safety
export interface AlphabetDocument extends Document {
  letter: string;
}

// Schema definition
const alphabetSchema: Schema<AlphabetDocument> = new Schema({
  letter: {
    type: String,
    required: true,
    uppercase: true,
    unique: true,
    enum: validAlphabets
  }
});

// Model export
export const Alphabet = mongoose.model<AlphabetDocument>('Alphabet', alphabetSchema);
