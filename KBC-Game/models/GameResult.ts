// models/GameResult.ts
import mongoose, { Schema, Document, Model } from "mongoose";

/** Prize ladder item */
interface IPrizeLevel {
  level: number;
  type: "money" | "gift";
  value: number | string;
  isSafe: boolean;
}

export interface IQuestionLite {
  id: mongoose.Types.ObjectId | string;
  bankId: mongoose.Types.ObjectId | string;
  question: string;             
  options: string[];           
  status?: string;              
  categories?: string[];        
  answer: string | null;       
  media?: {   public_id: string;   url: string;   type: string;  format: string; } | null;
}

export interface IGameResult extends Document {
  userId: mongoose.Types.ObjectId;
  userName:string;
  gameConfigId: mongoose.Types.ObjectId;
  finalScore: number;           
  isWinner: boolean;
  prizeLadder: IPrizeLevel[];
  totalTimeSeconds?: number;
  lifelinesUsed: string[];     
  questions: IQuestionLite[];   
  createdAt: Date;
  updatedAt: Date;
}

const PrizeLadderSchema = new Schema<IPrizeLevel>(
  {
    level: { type: Number, required: true },
    type: { type: String, enum: ["money", "gift"], required: true },
    value: { type: Schema.Types.Mixed, required: true },
    isSafe: { type: Boolean, required: true },
  },
  { _id: false }
);

const MediaSchema = new Schema(
  { public_id: { type: String }, url: { type: String },  type: { type: String }, format: { type: String }},
  { _id: false }
);

const QuestionLiteSchema = new Schema<IQuestionLite>(
  {
    id: { type: Schema.Types.Mixed, required: true },
    bankId: { type: Schema.Types.Mixed, required: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    status: { type: String, required: false },
    categories: { type: [String], required: false, default: [] },
    answer: { type: String, required: false, default: null },
    media: { type: MediaSchema, required: false, default: null },
  },
  { _id: false }
);

const GameResultSchema = new Schema<IGameResult>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "RegisteredUser", required: true },
    userName:{ type: String  },
    gameConfigId: { type: Schema.Types.ObjectId, ref: "GameConfig", required: true },

    finalScore: { type: Number, required: true },
    isWinner: { type: Boolean, required: true },
    totalTimeSeconds: { type: Number },

    lifelinesUsed: { type: [String], default: [] },
    prizeLadder: { type: [PrizeLadderSchema], default: [] },

    questions: { type: [QuestionLiteSchema], required: true, default: [] },
  },
  { timestamps: true }
);

GameResultSchema.index({ userId: 1, createdAt: -1 });
GameResultSchema.index({ gameConfigId: 1, createdAt: -1 });
GameResultSchema.index({ userId: 1, gameConfigId: 1 }, { unique: true });

export default (mongoose.models.GameResult as Model<IGameResult>) ||
  mongoose.model<IGameResult>("GameResult", GameResultSchema);