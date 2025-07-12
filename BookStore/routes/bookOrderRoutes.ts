import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  cancelOrder,
  refundOrder,
} from "../controllers/bookOrderController";

const router = express.Router();

router.post("/book-orders", createOrder);
router.get("/book-orders", getAllOrders);
router.get("/book-orders/:id", getOrderById);
router.put("/book-orders/:id", updateOrderStatus);
router.delete("/book-orders/:id", deleteOrder);
router.put("/book-orders/:id/cancel", cancelOrder);
router.put("/book-orders/:id/refund", refundOrder);

export default router;
