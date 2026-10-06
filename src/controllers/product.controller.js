import prisma from "../lib/prisma.js";
import {
  AppError,
  parseId,
  asyncHandler,
} from "../middleware/error.middleware.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, isActive, categoryId } = req.body;
  console.log("Request Body:", req.body);
  const mainImage = req.files?.mainImage?.[0];
  const supportingImages = req.files?.supportingImages || [];

  console.log("Main Image:", mainImage);
  console.log("Supporting Images:", supportingImages);

  if (!name || price === undefined || stock === undefined || !categoryId) {
    throw AppError(
      "Product name, price, stock, and categoryId are required",
      400,
    );
  }

  if (!mainImage) {
    throw AppError(
      "Main image is required. Use the field name: mainImage",
      400,
    );
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug: name,
      description,
      price,
      stock: 0,
      isActive: isActive === undefined ? true : Boolean(isActive),
      categoryId: Number(categoryId),
    },
    include: {
      category: true,
      images: true,
    },
  });

  // Upload main image
  const mainUpload = await uploadToCloudinary(mainImage.buffer);

  // Create main image record
  const mainProductImage = await prisma.productImage.create({
    data: {
      url: mainUpload.secure_url,
      isPrimary: true,
      productId: product.id,
    },
  });

  const supportingProductImages = [];

  for (const image of supportingImages) {
    const uploadResult = await uploadToCloudinary(image.buffer);

    const productImage = await prisma.productImage.create({
      data: {
        url: uploadResult.secure_url,
        isPrimary: false,
        productId: product.id,
      },
    });

    supportingProductImages.push(productImage);
  }
  res.status(201).json({
    success: true,
    data: {
      ...product,
      images: [mainProductImage, ...supportingProductImages],
    },
    // imagesUrl: [mainProductImage, ...supportingProductImages],
  });
}, "createProduct");

const getProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: true,
    },
    orderBy: {
      createdAt: "desc",
      // updatedAt: "desc",
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
