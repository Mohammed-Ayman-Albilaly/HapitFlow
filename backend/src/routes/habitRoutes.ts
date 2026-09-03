import { Router } from 'express';
import { getHabits, createHabit, updateHabit, deleteHabit } from '../controllers/habitController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, getHabits);
router.post('/', authMiddleware, createHabit);
router.patch('/:id', authMiddleware, updateHabit);
router.delete('/:id', authMiddleware, deleteHabit);

export default router;
