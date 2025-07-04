import mongoose, { Document, Schema } from 'mongoose';

export interface IFoodEntry {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  items: string[];
}

export interface IBmiPlan extends Document {
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: string;
  bmi: number;
  bmiCategory: string;
  foodPlan: IFoodEntry[];
  calorieTarget: number;
}

const FoodEntrySchema = new Schema<IFoodEntry>({
  type: { type: String, required: true },
  items: [String],
});

const BmiPlanSchema = new Schema<IBmiPlan>({
  height: Number,
  weight: Number,
  age: Number,
  gender: { type: String, enum: ['male', 'female'] },
  activityLevel: String,
  bmi: Number,
  bmiCategory: String,
  foodPlan: [FoodEntrySchema],
  calorieTarget: Number,
});

export const BmiPlan = mongoose.model<IBmiPlan>('BmiPlan', BmiPlanSchema);