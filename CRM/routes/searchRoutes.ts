import express from "express";
import { handleSearch } from "../controllers/searchController";

const router = express.Router();

router.get("/search", async (req, res, next) => {
  try {
	await handleSearch(req, res);
  } catch (err) {
	next(err);
  }
}); // e.g., /search?query=John

export default router;
