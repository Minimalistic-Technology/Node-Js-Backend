import express from 'express';
import { wrap } from "../utils/wrap";
import { authenticateJWT } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";
import { getActivityLogsForCustomer } from "../controllers/activityLogController";

const router = express.Router();

router.get(
  "/customer/:customerId",
  wrap(authenticateJWT),
  wrap(requireRole(["admin", "manager", "viewer"])),
  wrap(getActivityLogsForCustomer)
);

export default router;
