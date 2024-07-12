import cloudinary from 'cloudinary';
import { CLOUDINARY } from '../constants/index.js';
import { env } from './env.js';

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
