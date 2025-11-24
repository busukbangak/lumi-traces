import { Router } from 'express';
import { login, register, userReturn } from '../controllers/authController';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { authLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/auth/login', authLimiter, login);
router.post('/auth/register', register);
router.get('/auth/return', authenticateToken, userReturn);

export default router;
