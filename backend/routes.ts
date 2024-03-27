import { type Express } from 'express';
import weeklyReportRoutes from '@features/weekly-report/routes';

export default function (app: Express) {
	app.use('/weekly-report', weeklyReportRoutes);
}
