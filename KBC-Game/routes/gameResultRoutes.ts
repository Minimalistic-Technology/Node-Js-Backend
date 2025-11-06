import express from "express";
import { requireUserAuth } from "../middlewares/userAuthMiddleware";
import { createGameResult,
         getScoresForGameConfig,      
 } from "../controllers/gameResultController";

const router = express.Router();

router.post("/create", requireUserAuth, createGameResult);
router.get("/get", requireUserAuth, getScoresForGameConfig);


export default router;