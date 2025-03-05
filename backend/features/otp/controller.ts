import { authenticator } from 'otplib';
import { Request, Response, NextFunction } from 'express';

class OTPController {
	async generateOTP(req: Request, res: Response, next: NextFunction) {
		try {
			const secret = authenticator.generateSecret();
			const token = authenticator.generate('KJBTG4LRGRFEIYSXHFUFORC3GNJSC4JRNBYU2Y2NOU5FUZCXG5GQ====');
			res.json({ secret, token });
		} catch (error) {
			next(error);
		}
	}
}

const otpController = new OTPController();

export default otpController;
