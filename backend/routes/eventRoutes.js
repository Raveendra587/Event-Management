import express from 'express';
import { 
  createEvent, 
  getEvents, 
  updateEvent, 
  getEventLogs 
} from '../controllers/eventController.js';

const router = express.Router();

router.route('/').post(createEvent).get(getEvents);
router.route('/:id').put(updateEvent);
router.route('/:id/logs').get(getEventLogs);

export default router;