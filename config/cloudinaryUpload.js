import cloudinary from "./cloudinary.js";

const uploadToCloudinary = async (filePath) => {
  try {
    console.log("Uploading to Cloudinary:", filePath);

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "products",
      use_filename: true,
      unique_filename: false,
    });

    console.log("Cloudinary upload successful");

    return result;
  } catch (error) {
    console.error("Cloudinary upload error:");
    console.error(error);

    throw error;
  }
};

export default uploadToCloudinary;
