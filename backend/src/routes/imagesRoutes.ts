import { Router } from 'express';
import { upload } from '../middlewares/upload';
import { deleteImage, streamImage, uploadImage } from '../controllers/imagesController';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { verifyRecaptcha } from '../middlewares/recaptcha';

const router = Router();

router.post('/images', upload.single('image'), verifyRecaptcha, uploadImage);
router.get('/images/:id', streamImage);
router.delete('/images/:id', authenticateToken, requireAdmin, deleteImage);

export default router;
