import { Router } from 'express';
import { createTrace, deleteTrace, getTraceById, getTraces, updateTrace } from '../controllers/tracesController';
import { upload } from '../middlewares/upload';

const router = Router();

router.post('/traces', upload.single('image'), createTrace);
router.get('/traces', getTraces);
router.get('/traces/:id', getTraceById);
router.put('/traces/:id', updateTrace);
router.delete('/traces/:id', deleteTrace);

export default router;