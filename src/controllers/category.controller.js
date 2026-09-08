import prisma from "../lib/prisma.js";
import {
  AppError,
  parseId,
  asyncHandler,
} from "../middleware/error.middleware.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description } = req.body;

  if (!name || !slug) {
    throw AppError("Category name and slug are required", 400);
  }

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description,
    },
  });

  res.status(201).json({
    success: true,
    data: category,
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    include: {
      products: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  res.json({
    success: true,
    data: categories,
  });
});

const getCategoryById = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      products: true,
    },
  });

  if (!category) {
    throw AppError("Category not found", 404);
  }

  res.json({
    success: true,
    data: category,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const { name, slug, description } = req.body;

  const existing = await prisma.category.findUnique({
    where: { id },
  });

  if (!existing) {
    throw AppError("Category not found", 404);
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      name,
      slug,
      description,
    },
  });

  res.json({
    success: true,
    data: category,
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);

  const existing = await prisma.category.findUnique({
    where: { id },
  });

  if (!existing) {
    throw AppError("Category not found", 404);
  }

  await prisma.category.delete({
    where: { id },
  });

  res.json({
    success: true,
    data: existing,
  });
});

export {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
