import mongoose, { Schema, Document } from 'mongoose';

export interface ITest extends Document {
  name: string;
  link?: string;
  seeAlso?: string;
  firstLetter: string;
}

const TestSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  seeAlso: {
    type: String,
  },
  firstLetter: {
    type: String,
    required: true,
    uppercase: true,
    minlength: 1,
    maxlength: 1,
  },
});

export const TestModel = mongoose.model<ITest>('Test', TestSchema);
