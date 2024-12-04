import express from 'express';
import { uploadImages } from './controller';
const router = express.Router();

router.post('/', uploadImages);

export default router;
