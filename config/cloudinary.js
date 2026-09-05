import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API key:", process.env.CLOUDINARY_API_KEY);
console.log("API secret:", process.env.CLOUDINARY_API_SECRET);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});   

cloudinary.api.ping()
  .then((result) => {
    console.log("Cloudinary connection:", result);
  })
  .catch((error) => {
    console.error("Cloudinary connection failed:");
    console.error(error);
  });

export default cloudinary;
