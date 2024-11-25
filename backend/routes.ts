import { type Express } from 'express';
import weeklyReportRoutes from '@features/weekly-report/routes';
import uploadImagesRoutes from '@features/upload-images/routes';

export default function (app: Express) {
	app.use('/weekly-report', weeklyReportRoutes);
	app.use('/upload-images', uploadImagesRoutes);
}
