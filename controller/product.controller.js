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
      console.log("Request body:", req.body);
      console.log("Request file:", req.files);



      
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
