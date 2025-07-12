import express from "express";
import {
  createTestimonial,
  getTestimonials,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController";

const router = express.Router();

router.get("/testimonials", getTestimonials);
router.post("/testimonials", createTestimonial);
router.put("/testimonials/:id", updateTestimonial);
router.delete("/testimonials/:id", deleteTestimonial);

export default router;
