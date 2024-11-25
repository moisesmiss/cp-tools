import express from 'express';
// import { uploadImages } from './controller';
const router = express.Router();

router.post('/', (req, res, next) => {
	try {
		res.json({ ok: true });
	} catch (error) {
		next(error);
	}
});

export default router;
