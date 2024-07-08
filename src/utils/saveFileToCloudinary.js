import cloudinary from 'cloudinary';
import { env } from './env.js';
import { CLOUDINARY } from '../constants/index.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: CLOUDINARY.CLOUD_NAME,
  api_key: env(CLOUDINARY.API_KEY),
  api_secret: env(CLOUDINARY.API_SECRET),
});

export const saveFileToCloudinary = async file => {
  const response = await cloudinary.v2.uploader.upload(file.path);

  process.env.ENABLE_CLOUDINARY = 'true';
  process.on('exit', () => {
    process.env.ENABLE_CLOUDINARY = 'false';
  });

  return response.secure_url;
};
