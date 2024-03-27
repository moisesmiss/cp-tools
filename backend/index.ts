import 'module-alias/register';
import express, { Request, Response } from 'express';
import routeMaker from './routes';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
	res.send('¡Hola, mundo!');
});
routeMaker(app);

app.listen(PORT, () => {
	console.log(`Server running in http://localhost:${PORT}`);
});
