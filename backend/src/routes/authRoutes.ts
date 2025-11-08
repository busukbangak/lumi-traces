import { Router } from 'express';
import { login, register, userReturn } from '../controllers/authController';
import { authenticateToken, requireAdmin } from '../middlewares/auth';

const router = Router();

router.post('/auth/login', login);
/* router.post('/auth/register', register); */
router.get('/auth/return', authenticateToken, userReturn);

export default router;
