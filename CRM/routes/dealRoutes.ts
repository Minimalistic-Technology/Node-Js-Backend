import express from "express";
import {
  createDeal,
  getAllDeals,
  getDealById,
  updateDeal,
  deleteDeal,
} from "../controllers/dealController";

const router = express.Router();

router.post("/deals", createDeal);
router.get("/deals", getAllDeals);
router.get("/deals/:id", getDealById);
router.put("/deals/:id", updateDeal);
router.delete("/deals/:id", deleteDeal);

export default router;
