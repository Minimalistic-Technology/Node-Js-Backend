import express from "express";
import {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  addResponseToTicket,
} from "../controllers/ticketController";

import {
  createFAQ,
  getAllFAQs,
  updateFAQ,
  deleteFAQ,
} from "../controllers/faqController";

const router = express.Router();

// Ticket routes
router.post("/tickets", createTicket);
router.get("/tickets", getAllTickets);
router.get("/tickets/:id", getTicketById);
router.put("/tickets/:id", updateTicket);
router.delete("/tickets/:id", deleteTicket);
router.post("/tickets/:id/responses", addResponseToTicket);

// FAQ routes
router.post("/faqs", createFAQ);
router.get("/faqs", getAllFAQs);
router.put("/faqs/:id", updateFAQ);
router.delete("/faqs/:id", deleteFAQ);

export default router;
