import { Router } from 'express';
import eventController from '../../controllers/hospital/event';

const router = Router();

// Route to get all events
router.get('/events', eventController.getAllEvents);

// Route to get an event by ID
router.get('/event/:id', eventController.getEventById);

// Route to create a new event
router.post('/events', eventController.createEvent);

// Route to update an event by ID
router.put('/events/:id', eventController.updateEvent);

// Route to delete an event by ID
router.delete('/events/:id', eventController.deleteEvent);

export default router;
