import multer from "multer";
import { AppError } from "./error.middleware.js";

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(AppError("Only image files are allowed", 400));
  }

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
