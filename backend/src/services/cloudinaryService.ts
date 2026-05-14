import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

const configured = Boolean(process.env.CLOUDINARY_URL);
if (configured) {
  cloudinary.config({ url: process.env.CLOUDINARY_URL });
}

export interface UploadResult {
  url: string;
  publicId: string;
}

export function uploadImage(buffer: Buffer, filename: string): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    if (!configured) {
      reject(new Error('CLOUDINARY_URL is not set'));
      return;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'idrip-wardrobe',
        public_id: `${Date.now()}-${filename.replace(/\.[^.]+$/, '')}`,
        transformation: [
          { width: 1200, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({ url: result!.secure_url, publicId: result!.public_id });
        }
      }
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
}

export function deleteImage(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!configured) {
      reject(new Error('CLOUDINARY_URL is not set'));
      return;
    }

    cloudinary.uploader.destroy(publicId, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}
