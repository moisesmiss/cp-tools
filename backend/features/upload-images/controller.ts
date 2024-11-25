import { Request, Response } from 'express';
import { root } from '@constants/directories';
import multer from 'multer';
import path from 'path';

// Configure multer
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadPath = path.join(root, 'uploads'); // Ruta donde se guardarán las imágenes
		cb(null, uploadPath);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		const fileExtension = path.extname(file.originalname);
		cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
	},
});

// Middleware de multer
const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		// Validar solo imágenes
		if (!file.mimetype.startsWith('image/')) {
			return cb(new Error('Only image files are allowed!'));
		}
		cb(null, true);
	},
	limits: { fileSize: 12 * 1024 * 1024 }, // Limitar tamaño del archivo (5 MB)
}).array('photos', 10); // Manejar múltiples imágenes (máximo 10)

// Controlador
export const uploadImages = (req: Request, res: Response): void => {
	upload(req, res, (err) => {
		if (err) {
			return res.status(400).json({ message: err.message });
		}

		// Si no hay archivos
		if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
			return res.status(400).json({ message: 'No files uploaded' });
		}

		// Respuesta exitosa
		const uploadedFiles = (req.files as Express.Multer.File[]).map((file) => ({
			originalName: file.originalname,
			path: file.path,
			size: file.size,
		}));

		res.status(200).json({
			message: 'Files uploaded successfully',
			files: uploadedFiles,
		});
	});
};
