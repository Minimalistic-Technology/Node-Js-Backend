import express from "express";
import { handleSearch } from "../controllers/searchController";

const router = express.Router();

// Example: GET /api/search?query=John
router.get("/", handleSearch);

export default router;
