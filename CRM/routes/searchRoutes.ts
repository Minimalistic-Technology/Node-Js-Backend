import express from "express";
import { handleSearch } from "../controllers/searchController";

const router = express.Router();

// Example: GET /api/search?query=John
router.get("/search", handleSearch);

export default router;
