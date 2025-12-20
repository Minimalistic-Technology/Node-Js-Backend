import mongoose, { Document, Schema } from 'mongoose';


const validLetters = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U',
  'V', 'W', 'X', 'Y', 'Z', '#'
] as const;

export type AlphabetLetter = typeof validLetters[number];

export interface IAlphabet extends Document {
  letter: AlphabetLetter;
}

const alphabetSchema: Schema<IAlphabet> = new Schema({
  letter: {
    type: String,
    required: true,
    uppercase: true,
    unique: true,
    enum: validLetters
  }
});

const Alphabet = mongoose.model<IAlphabet>('Alphabet', alphabetSchema);
export default Alphabet;
