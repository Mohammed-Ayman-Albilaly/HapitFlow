import { Router } from 'express';
import { completeHabit, getHabitHistory } from '../controllers/trackingController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/:id/complete', authMiddleware, completeHabit);
router.get('/:id/history', authMiddleware, getHabitHistory);

export default router;
