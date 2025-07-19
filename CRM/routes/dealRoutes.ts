import express from "express";
import {
  createDeal,
  getAllDeals,
  getDealById,
  updateDeal,
  deleteDeal,
} from "../controllers/dealController";

const router = express.Router();

router.post("/", createDeal);
router.get("/", getAllDeals);
router.get("/:id", getDealById);
router.put("/:id", updateDeal);
router.delete("/:id", deleteDeal);

export default router;
