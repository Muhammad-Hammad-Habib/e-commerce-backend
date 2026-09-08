import cloudinary from "../config/cloudinary.js";
import { AppError } from "../middleware/error.middleware.js";

export function uploadToCloudinary(fileBuffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "kacha-papar/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(
            AppError(error.message || "Cloudinary upload failed", 500)
          );
        }

        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
}
