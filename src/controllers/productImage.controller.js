import prisma from "../lib/prisma.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";
import {
  AppError,
  parseId,
  asyncHandler,
} from "../middleware/error.middleware.js";

function parseBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return String(value).toLowerCase() === "true";
}

const createProductImage = asyncHandler(async (req, res) => {
  const { productId, isPrimary } = req.body;

  const mainImage = req.files?.mainImage?.[0];
  const supportingImages = req.files?.supportingImages || [];

  if (!mainImage) {
    throw AppError(
      "Main image is required. Use the field name: mainImage",
      400,
    );
  }

  if (!productId) {
    throw AppError("productId is required", 400);
  }

  const parsedProductId = Number(productId);

  const product = await prisma.product.findUnique({
    where: { id: parsedProductId },
  });

  if (!product) {
    throw AppError("Product not found", 404);
  }

  // Upload main image
  const mainUpload = await uploadToCloudinary(mainImage.buffer);

  // Create main image record
  const mainProductImage = await prisma.productImage.create({
    data: {
      url: mainUpload.secure_url,
      isPrimary: true,
      productId: parsedProductId,
    },
  });

  // Upload supporting images
  const supportingProductImages = [];

  for (const image of supportingImages) {
    const uploadResult = await uploadToCloudinary(image.buffer);

    const productImage = await prisma.productImage.create({
      data: {
        url: uploadResult.secure_url,
        isPrimary: false,
        productId: parsedProductId,
      },
    });

    supportingProductImages.push(productImage);
  }

  res.status(201).json({
    success: true,
    data: {
      mainImage: mainProductImage,
      supportingImages: supportingProductImages,
    },
  });
});

const getProductImages = asyncHandler(async (req, res) => {
  const productImages = await prisma.productImage.findMany({
    include: {
      product: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  res.json({
    success: true,
    data: productImages,
  });
});

const getProductImageById = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);

  const productImage = await prisma.productImage.findUnique({
    where: { id },
    include: {
      product: true,
    },
  });

  if (!productImage) {
    throw AppError("Product image not found", 404);
  }

  res.json({
    success: true,
    data: productImage,
  });
});

const updateProductImage = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const { productId, isPrimary } = req.body;

  const existing = await prisma.productImage.findUnique({
    where: { id },
  });

  if (!existing) {
    throw AppError("Product image not found", 404);
  }

  let url = existing.url;

  if (req.file) {
    const uploadResult = await uploadToCloudinary(req.file.buffer);
    url = uploadResult.secure_url;
  }

  const productImage = await prisma.productImage.update({
    where: { id },
    data: {
      url,
      isPrimary:
        isPrimary === undefined
          ? undefined
          : parseBoolean(isPrimary, existing.isPrimary),
      productId: productId === undefined ? undefined : Number(productId),
    },
    include: {
      product: true,
    },
  });

  res.json({
    success: true,
    data: productImage,
  });
});

const deleteProductImage = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);

  const existing = await prisma.productImage.findUnique({
    where: { id },
    include: {
      product: true,
    },
  });

  if (!existing) {
    throw AppError("Product image not found", 404);
  }

  await prisma.productImage.delete({
    where: { id },
  });

  res.json({
    success: true,
    data: existing,
  });
});

export {
  createProductImage,
  getProductImages,
  getProductImageById,
  updateProductImage,
  deleteProductImage,
};
