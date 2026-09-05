import uploadToCloudinary from "../config/cloudinaryUpload.js";
import prismadb from "../database/database.config.js";

class ProductController {
  static async getProducts(req, res) {
    try {
      const products = await prismadb.product.findMany();

      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to fetch products",
        error: error.message,
      });
    }
  }

  static async createProduct(req, res) {
    try {
      // console.log("Request body:", req.body);
      // console.log("Request files:", req.files);

      const mainImage = req.files?.mainImage?.[0];
      const supportingImages = req.files?.supportingImages || [];

      // Main image is required
      if (!mainImage) {
        return res.status(400).json({
          message: "Main image is required",
        });
      }

      // Upload main image
      console.log("Uploading main image...");

      const mainImageResult = await uploadToCloudinary(mainImage.path);

      console.log("Main image URL:", mainImageResult.secure_url);

      // Upload supporting images
      const supportingImageResults = await Promise.all(
        supportingImages.map((file) => uploadToCloudinary(file.path)),
      );

      const supportingImageUrls = supportingImageResults.map(
        (result) => result.secure_url,
      );

      console.log("Supporting image URLs:", supportingImageUrls);

      return res.status(201).json({
        message: "Images uploaded successfully",

        mainImage: mainImageResult.secure_url,

        supportingImages: supportingImageUrls,
      });
      // const { name, price, description, category } = req.body;

      // if (!name?.trim() || !price || !category) {
      //   return res.status(400).json({
      //     message:
      //       "Product name, price, description, and category are required",
      //   });
      // }

      // const product = await prismadb.product.create({
      //   data: {
      //     name: name.trim(),
      //     price: Number(price),
      //     description: description.trim(),
      //     category: category.trim(),
      //   },
      // });

      return res.json({
        message: "Product created successfully",
      });
      // return res.status(201).json(product);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to create product",
        error: error.message,
      });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          message: "Product ID is required",
        });
      }

      const product = await prismadb.product.delete({
        where: { id: Number(id) },
      });

      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to delete product",
        error: error.message,
      });
    }
  }
}

export default ProductController;
