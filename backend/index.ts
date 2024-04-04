import express, { Request, Response } from 'express';
import { AxiosError } from 'axios';
import 'module-alias/register';
import dotenv from 'dotenv';
import { root } from '@constants/directories';
dotenv.config({ path: `${root}/.env` });
import routes from './routes';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
	res.send(process.env.CLICKUP_API_TOKEN);
});
routes(app);
app.use((err: any, req: any, res: any) => {
	if (err.isAxiosError) {
		console.log(err);
		res.json(err.response.data);
	}
	console.log(err);
});
process.on('uncaughtException', function (err: Error | AxiosError) {
	console.log('Uncaught Exception: ', err.message);
});
app.listen(PORT, () => {
	console.log(`Server running in http://localhost:${PORT}`);
});
