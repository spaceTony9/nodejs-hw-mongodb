import cloudinary from 'cloudinary';
import { env } from './env.js';
import { CLOUDINARY } from '../constants/index.js';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.v2.config({
  secure: true,
  cloud_name: env(CLOUDINARY.CLOUDINARY_CLOUD_NAME),
  api_key: env(CLOUDINARY.CLOUDINARY_API_KEY),
  api_secret: env(CLOUDINARY.CLOUDINARY_API_SECRET),
});

export const saveFileToCloudinary = async file => {
  const response = await cloudinary.v2.uploader.upload(file.path);
  return response.secure_url;
};
