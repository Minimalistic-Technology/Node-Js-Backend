import { Request, Response } from "express";
import mongoose, { SortOrder } from "mongoose";
import  GameResult  from "../models/GameResult";
import GameConfig from "../models/GameConfig";
import Question from "../models/Question";


export const createGameResult = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?._id;
    const userF = user?.firstName;
    const userL = user?.lastName;
    const userName = `${userF} ${userL}`;


    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    
    const {
      gameConfigId,
      correctAnswered,            
      isWinner,
      totalTimeSeconds,
      usedLifelinesArr,          
      lifelinesUsed,             
      prizeLadder = [],
      questions = [],
    } = req.body;

    if (!userId) return res.status(400).json({ message: "Invalid or missing userId" });
    if (!gameConfigId) return res.status(400).json({ message: "Invalid or missing gameConfigId" });
    if (typeof isWinner !== "boolean") return res.status(400).json({ message: "Invalid isWinner" });
    if (typeof totalTimeSeconds !== "number" || totalTimeSeconds < 0)
      return res.status(400).json({ message: "Invalid totalTimeSeconds" });
    if (typeof correctAnswered !== "number" || correctAnswered < 0)
      return res.status(400).json({ message: "Invalid correctAnswered" });
    if (!Array.isArray(questions) || questions.length === 0)
      return res.status(400).json({ message: "questions array is required" });


    const existing = await GameResult.findOne({ userId, gameConfigId }).lean();
    if (existing) {
      return res.status(409).json({
        message: "Game result already exists for this user and gameConfig",
        result: existing,
      });
    }

    // Normalize lifelines
    const lifelinesUsedFinal: string[] = Array.isArray(lifelinesUsed)
      ? lifelinesUsed
      : Array.isArray(usedLifelinesArr)
      ? usedLifelinesArr
      : [];


    const safeQuestions = questions.map((q: any) => ({
      id: q.id,
      bankId: q.bankId,
      question: q.question ?? q.text,    
      options: Array.isArray(q.options) ? q.options.map(String) : [],
      status: q.status ?? undefined,
      categories: Array.isArray(q.categories) ? q.categories : [],
      answer: q.answer ?? null,
      media: q.media ?? null,             
    }));

    const totalQuestions = safeQuestions.length;
    const finalScore =
      totalQuestions > 0
        ? Math.max(0, Math.min(100, Math.round((correctAnswered / totalQuestions) * 100)))
        : 0;

    const doc = await GameResult.create({
      userId,
      userName,
      gameConfigId,
      finalScore,
      isWinner,
      totalTimeSeconds,
      lifelinesUsed: lifelinesUsedFinal,
      prizeLadder,
      questions: safeQuestions,
    });

    return res.status(201).json({ message: "Game result saved", result: doc });
  } catch (err: any) {
    console.error("[createGameResult] Error:", err);
    return res
      .status(500)
      .json({ message: "Failed to save game result", error: err?.message });
  }
};

export const getScoresForGameConfig = async (req: Request, res: Response) => {
  try {
    const activeConfig = await GameConfig.findOne({ isActive: true });
        if (!activeConfig) {
          res.status(404).json({ message: "No active game configuration found" });
          return;
        }
    const gameConfigId = activeConfig._id
    const { sort = "score", page = "1", limit = "50" } = req.query as {
      sort?: "score" | "recent" | string;
      page?: string;
      limit?: string;
    };

    if (!gameConfigId || !mongoose.Types.ObjectId.isValid(gameConfigId)) {
      return res.status(400).json({ message: "Invalid or missing gameConfigId" });
    }

    const p = Math.max(parseInt(page, 10) || 1, 1);
    const l = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);

    let sortStage: Record<string, SortOrder>;

    if (sort === "recent") {
      sortStage = { createdAt: -1 as SortOrder };
    } else {
      sortStage = { finalScore: -1 as SortOrder, createdAt: -1 as SortOrder };
    }

    const filter = { gameConfigId: new mongoose.Types.ObjectId(gameConfigId) };

    const [results, total] = await Promise.all([
      GameResult.find(filter)
        .select({
          userId: 1,
          userName: 1,
          finalScore: 1,
          isWinner: 1,
          totalTimeSeconds: 1,
          createdAt: 1,
          questions: 1 ,
        })
        .sort(sortStage)
        .skip((p - 1) * l)
        .limit(l)
        .lean(),
      GameResult.countDocuments(filter),
    ]);

    return res.status(200).json({
      results,
      total,
      page: p,
      limit: l,
      pages: Math.ceil(total / l),
      sort: sort === "recent" ? "recent" : "score",
    });
  } catch (err: any) {
    console.error("[getScoresForGameConfig] Error:", err);
    return res.status(500).json({
      message: "Failed to fetch scores",
      error: err?.message,
    });
  }
};