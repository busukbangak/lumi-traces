import { Router } from 'express';
import { upload } from '../middlewares/upload';
import { deleteImage, streamImage, uploadImage } from '../controllers/imagesController';
import { authenticateToken, requireAdmin } from '../middlewares/auth';

const router = Router();

router.post('/images', upload.single('image'), uploadImage);
router.get('/images/:id', streamImage);
router.delete('/images/:id', authenticateToken, requireAdmin, deleteImage);

export default router;
