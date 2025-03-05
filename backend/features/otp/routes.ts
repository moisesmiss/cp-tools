import express from 'express';
import OTPController from './controller';
const router = express.Router();

router.get('/', OTPController.generateOTP.bind(OTPController));

export default router;
