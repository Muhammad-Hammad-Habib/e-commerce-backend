import prismadb from "../database/database.config.js";

class CategoryController {
  static async getCategories(req, res) {
    try {
      const categories = await prismadb.category.findMany();

      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to fetch categories",
        error: error.message,
      });
    }
  }

  static async createCategory(req, res) {
    try {
      const { name } = req.body;

      if (!name?.trim()) {
        return res.status(400).json({
          message: "Category name is required",
        });
      }

      const category = await prismadb.category.create({
        data: {
          name: name.trim(),
        },
      });

      return res.status(201).json(category);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to create category",
        error: error.message,
      });
    }
  }

  static async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          message: "Category ID is required",
        });
      }

      const category = await prismadb.category.delete({
        where: { id: Number(id) },
      });

      return res.status(200).json(category);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to delete category",
        error: error.message,
      });
    }
  }
}

export default CategoryController;
