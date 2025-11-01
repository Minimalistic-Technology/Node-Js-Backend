import { Request, Response } from "express";
import ActiveSession from "../models/ActiveSession";
import GameConfig from "../models/GameConfig";

export const startOrResumeSession = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const activeConfig = await GameConfig.findOne({ isActive: true });
    if (!activeConfig)
      return res.status(404).json({ message: "No active game configuration found" });

    const { gameConfigId, questions, prizeLadder, lifelines } = req.body;
    if (!gameConfigId || !questions || !prizeLadder || !lifelines) {
      return res.status(400).json({ message: "Missing required session data" });
    }

    // 🧩 Step 1 — Check for unfinished session for current config
    let existingSession = await ActiveSession.findOne({
      userId,
      gameConfigId: activeConfig._id,
      isCompleted: false,
    });

    if (existingSession) {
      return res.status(200).json({
        message: "Resumed existing session",
        session: existingSession,
      });
    }

    // 🧩 Step 2 — Check if completed session exists for current config
    const completedSession = await ActiveSession.findOne({
      userId,
      gameConfigId: activeConfig._id,
      isCompleted: true,
    });

    if (completedSession) {
      return res.status(206).json({
        message: "You have already completed this session",
        session: completedSession,
      });
    }

    // 🧩 Step 3 — Remove any old session tied to a different config
    await ActiveSession.deleteMany({
      userId,
      gameConfigId: { $ne: activeConfig._id },
      isCompleted: false,
    });

    // 🧩 Step 4 — Create new session for current config
    const newSession = await ActiveSession.create({
      userId,
      gameConfigId: activeConfig._id,
      questions,
      prizeLadder,
      lifelines,
      currentQuestionIndex: 0,
      currentPrizeLevel: 0,
      isCompleted: false,
    });

    return res.status(201).json({
      message: "Game session started successfully",
      session: newSession,
    });
  } catch (error: any) {
    console.error("Error creating/resuming session:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// 🎯 Get Active Session (current state)
export const getActiveSession = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?._id;

    const session = await ActiveSession.findOne({ userId, isCompleted: false });

    if (!session) {
      return res.status(404).json({ message: "No active session found" });
    }

    res.status(200).json({ session });
  } catch (error: any) {
    console.error("Error in getActiveSession:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const updateSession = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?._id;

    const {
      currentQuestionIndex,
      lifelines,
      questionId,
      isCorrect,
    } = req.body;

    const session = await ActiveSession.findOne({ userId, isCompleted: false });
    if (!session) {
      return res.status(404).json({ message: "Active session not found" });
    }

    // 🔹 Update current question progress
    if (currentQuestionIndex !== undefined) {
      session.currentQuestionIndex = currentQuestionIndex;
    }

    // 🔹 Update lifelines
    if (lifelines) {
      session.lifelines = lifelines;
    }

    // 🔹 Update specific question status (optional)
    if (questionId) {
      const question = session.questions.find(
        (q: any) => q._id.toString() === questionId
      );
      if (question) {
        question.isAsked = true;
        question.answeredCorrectly = !!isCorrect;
      }
    }


    await session.save();

    res.status(200).json({
      message: "Session updated successfully",
      session,
    });
  } catch (error: any) {
    console.error("Error in updateSession:", error);
    res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

// 🏁 Complete Session
export const completeSession = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?._id;

    const session = await ActiveSession.findOneAndUpdate(
      { userId, isCompleted: false },
      { isCompleted: true, completedAt: new Date() },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: "No active session found" });
    }

    res.status(200).json({
      message: "Game session completed successfully",
      session,
    });
  } catch (error: any) {
    console.error("Error in completeSession:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};