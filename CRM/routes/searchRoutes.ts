import express from "express";
import { handleSearch } from "../controllers/searchController";

const router = express.Router();


router.get("/search", handleSearch);

export default router;
