import { Router } from 'express';
import { createTrace, deleteTrace, getTraceById, getTraces, updateTrace } from '../controllers/tracesController';

const router = Router();

router.post('/traces', createTrace);
router.get('/traces', getTraces);
router.get('/traces/:id', getTraceById);
router.put('/traces/:id', updateTrace);
router.delete('/traces/:id', deleteTrace);

export default router;