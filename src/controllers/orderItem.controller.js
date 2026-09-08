import prisma from "../lib/prisma.js";
import {
  AppError,
  parseId,
  asyncHandler,
} from "../middleware/error.middleware.js";

const createOrderItem = asyncHandler(async (req, res) => {
  const { quantity, price, orderId, productId } = req.body;

  if (!quantity || price === undefined || !orderId || !productId) {
    throw AppError("quantity, price, orderId, and productId are required", 400);
  }

  const orderItem = await prisma.orderItem.create({
    data: {
      quantity: Number(quantity),
      price,
      orderId: Number(orderId),
      productId: Number(productId),
    },
    include: {
      order: true,
      product: true,
    },
  });

  res.status(201).json({
    success: true,
    data: orderItem,
  });
});

const getOrderItems = asyncHandler(async (req, res) => {
  const orderItems = await prisma.orderItem.findMany({
    include: {
      order: true,
      product: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  res.json({
    success: true,
    data: orderItems,
  });
});

const getOrderItemById = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);

  const orderItem = await prisma.orderItem.findUnique({
    where: { id },
    include: {
      order: true,
      product: true,
    },
  });

  if (!orderItem) {
    throw AppError("Order item not found", 404);
  }

  res.json({
    success: true,
    data: orderItem,
  });
});

const updateOrderItem = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const { quantity, price, orderId, productId } = req.body;

  const existing = await prisma.orderItem.findUnique({
    where: { id },
  });

  if (!existing) {
    throw AppError("Order item not found", 404);
  }

  const orderItem = await prisma.orderItem.update({
    where: { id },
    data: {
      quantity: quantity === undefined ? undefined : Number(quantity),
      price,
      orderId: orderId === undefined ? undefined : Number(orderId),
      productId: productId === undefined ? undefined : Number(productId),
    },
    include: {
      order: true,
      product: true,
    },
  });

  res.json({
    success: true,
    data: orderItem,
  });
});

const deleteOrderItem = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);

  const existing = await prisma.orderItem.findUnique({
    where: { id },
  });

  if (!existing) {
    throw AppError("Order item not found", 404);
  }

  await prisma.orderItem.delete({
    where: { id },
  });

  res.json({
    success: true,
    data: existing,
  });
});

export {
  createOrderItem,
  getOrderItems,
  getOrderItemById,
  updateOrderItem,
  deleteOrderItem,
};
