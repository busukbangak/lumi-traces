import { Router } from 'express';
import { login, register, verifyToken } from '../controllers/authController';
import { authenticateToken, requireAdmin } from '../middlewares/auth';

const router = Router();

router.post('/auth/login', login);
/* router.post('/auth/register', register); */
router.get('/auth/verify', authenticateToken, verifyToken);

export default router;
