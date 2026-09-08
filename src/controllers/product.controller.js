import prisma from "../lib/prisma.js";
import {
  AppError,
  parseId,
  asyncHandler,
} from "../middleware/error.middleware.js";

const createProduct = asyncHandler(async (req, res) => {
  const { name, slug, description, price, stock, isActive, categoryId } =
    req.body;

  if (!name || !slug || price === undefined || stock === undefined || !categoryId) {
    throw AppError(
      "Product name, slug, price, stock, and categoryId are required",
      400
    );
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price,
      stock: Number(stock),
      isActive: isActive === undefined ? true : Boolean(isActive),
      categoryId: Number(categoryId),
    },
    include: {
      category: true,
      images: true,
    },
  });

  res.status(201).json({
    success: true,
    data: product,
  });
});

const getProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  res.json({
    success: true,
    data: products,
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: true,
    },
  });

  if (!product) {
    throw AppError("Product not found", 404);
  }

  res.json({
    success: true,
    data: product,
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const { name, slug, description, price, stock, isActive, categoryId } =
    req.body;

  const existing = await prisma.product.findUnique({
    where: { id },
  });

  if (!existing) {
    throw AppError("Product not found", 404);
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      price,
      stock: stock === undefined ? undefined : Number(stock),
      isActive: isActive === undefined ? undefined : Boolean(isActive),
      categoryId: categoryId === undefined ? undefined : Number(categoryId),
    },
    include: {
      category: true,
      images: true,
    },
  });

  res.json({
    success: true,
    data: product,
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);

  const existing = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: true,
    },
  });

  if (!existing) {
    throw AppError("Product not found", 404);
  }

  await prisma.product.delete({
    where: { id },
  });

  res.json({
    success: true,
    data: existing,
  });
});

export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
