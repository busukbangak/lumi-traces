import { Router } from 'express';
import { createTrace, deleteTrace, getTraceById, getTraces, updateTrace } from '../controllers/tracesController';
import { upload } from '../middlewares/upload';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { verifyRecaptcha } from '../middlewares/recaptcha';

const router = Router();

router.post('/traces', upload.single('image'), verifyRecaptcha, createTrace);
router.get('/traces', getTraces);
router.get('/traces/:id', getTraceById);
router.put('/traces/:id', authenticateToken, requireAdmin, updateTrace);
router.delete('/traces/:id', authenticateToken, requireAdmin, deleteTrace);

export default router;