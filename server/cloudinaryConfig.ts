import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    cb(new Error('Type de fichier invalide. Seuls les formats JPEG, JPG et PNG sont autorisés.') as any, false);
  } else {
    cb(null, true);
  }
};


const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    // @ts-ignore
    folder: 'user_images',
    format: async () => 'png',
    public_id: (req, file) => file.fieldname + '-' + Date.now(),
  },
  });

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
}).single('file');

export default upload;

