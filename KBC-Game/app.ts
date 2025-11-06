require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { rateLimit } from "express-rate-limit";
import errorMiddleware from "./middleware/error";

import adminAuthRoutes from "../KBC-Game/routes/adminAuthRoutes";
import questionBankRoutes from "../KBC-Game/routes/questionBankRoutes";
import questionRoutes from "../KBC-Game/routes/questionRoutes";
import mediaAssetRoutes from "../KBC-Game/routes/mediaAssetRoutes";
import ageContentRoutes from "../KBC-Game/routes/ageContentRoutes";
import pinRoutes from "../KBC-Game/routes/pinRoutes";
import gameConfigRoutes from '../KBC-Game/routes/gameConfigRoutes';
import userRoutes from '../KBC-Game/routes/userRoutes';
import gameRoutes from '../KBC-Game/routes/gameRoutes';
import AuthRoutes from "../KBC-Game/routes/authRoutes";
import importExportRoutes from "../KBC-Game/routes/importExportRoutes";
import activeSessionRoutes from "../KBC-Game/routes/activeSessionRoutes";
import gameresultRoutes from "../KBC-Game/routes/gameResultRoutes"

export const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',  
    credentials: true,                
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  }));

const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 1000, 
  standardHeaders: true,
  legacyHeaders: false,
  handler: function (req, res, next) {
    setTimeout(() => {
      next();
    }, 5000); 
  },
});
app.use(limiter);
export { limiter };

app.use("/auth", adminAuthRoutes);
app.use("/api/questions", questionBankRoutes);
app.use("/api", questionRoutes);
app.use("/api/media", mediaAssetRoutes);
app.use("/api/age-content", ageContentRoutes);
app.use("/api/pin", pinRoutes);
app.use("/api/v1/game-config", gameConfigRoutes);
app.use("/api/users", userRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/import-export", importExportRoutes);
app.use("/api/session", activeSessionRoutes);
app.use("/api/score", gameresultRoutes);
app.get("/test", async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "GET API is working",
  });
});

app.get("/test-db", async (req: Request, res: Response) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).json({ message: "MongoDB is connected" });
  } catch (err) {
    res.status(500).json({ error: "MongoDB connection failed", details: err });
  }
});

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(errorMiddleware);

export default app;
