"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_1 = __importDefault(require("../../controllers/hospital/event"));
const router = (0, express_1.Router)();
// Route to get all events
router.get('/events', event_1.default.getAllEvents);
// Route to get an event by ID
router.get('/event/:id', event_1.default.getEventById);
// Route to create a new event
router.post('/events', event_1.default.createEvent);
// Route to update an event by ID
router.put('/events/:id', event_1.default.updateEvent);
// Route to delete an event by ID
router.delete('/events/:id', event_1.default.deleteEvent);
exports.default = router;
