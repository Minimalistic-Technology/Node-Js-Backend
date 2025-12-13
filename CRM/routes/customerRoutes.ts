import express from 'express';
import { listCustomers, getCustomer, updateCustomer } from "../controllers/customerController";
import { authenticateJWT } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";
import { validateBody } from "../middleware/validationMiddleware";
import { wrap } from "../utils/wrap";
import { z } from "zod";

const router = express.Router();

const listQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sortBy: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  q: z.string().optional(),
  filter: z.any().optional(),
});

const updateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  assignedTo: z.string().optional(),
  status: z.enum(["prospect", "active", "churned"]).optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.any().optional(),
});

router.get("/", wrap(authenticateJWT), wrap(listCustomers));
router.get("/:id", wrap(authenticateJWT), wrap(getCustomer));
router.put("/:id", wrap(authenticateJWT), wrap(validateBody(updateSchema)), wrap(updateCustomer));

export default router;
