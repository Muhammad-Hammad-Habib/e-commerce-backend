import multer from "multer";
import { AppError } from "./error.middleware.js";
import path from "path";

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  // this is temp solution for file filter  but after need to check MIME type in production level
  const ext = path.extname(file.originalname).toLowerCase();

  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  const isValidExtension = allowedExtensions.includes(ext);

  if (!isValidExtension) {
    return cb(AppError("Only image files are allowed", 400));
  }
  // const isValidMimeType = file.mimetype.startsWith("image/");

  // if (!isValidExtension || !isValidMimeType) {
  //   return cb(AppError("Only image files are allowed", 400));
  // }

  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
