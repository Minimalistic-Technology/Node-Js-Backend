import { Router } from 'express';
import { getCancelReasons, submitCancelRequest } from '../controllers/cancelController';

const router = Router();

router.get('/cancel-reasons', getCancelReasons);
router.post('/cancel-request', submitCancelRequest);

export default router;
