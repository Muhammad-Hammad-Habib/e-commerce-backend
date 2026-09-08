import prisma from "../lib/prisma.js";
import {
  AppError,
  parseId,
  asyncHandler,
} from "../middleware/error.middleware.js";

const createOrder = asyncHandler(async (req, res) => {
  const {
    orderNumber,
    status,
    subtotal,
    deliveryFee,
    total,
    paymentMethod,
    userId,
    addressId,
  } = req.body;

  if (
    subtotal === undefined ||
    total === undefined ||
    !userId ||
    !addressId
  ) {
    throw AppError("subtotal, total, userId, and addressId are required", 400);
  }

  const order = await prisma.order.create({
    data: {
      orderNumber: orderNumber || `ORD-${Date.now()}`,
      status,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      userId: Number(userId),
      addressId: Number(addressId),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
      },
      address: true,
      items: {
        include: {
          product: true,
        },
      },
      payment: true,
    },
  });

  res.status(201).json({
    success: true,
    data: order,
  });
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      address: true,
      items: true,
      payment: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  res.json({
    success: true,
    data: orders,
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
      },
      address: true,
      items: {
        include: {
          product: true,
        },
      },
      payment: true,
    },
  });

  if (!order) {
    throw AppError("Order not found", 404);
  }

  res.json({
    success: true,
    data: order,
  });
});

const updateOrder = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const {
    orderNumber,
    status,
    subtotal,
    deliveryFee,
    total,
    paymentMethod,
    userId,
    addressId,
  } = req.body;

  const existing = await prisma.order.findUnique({
    where: { id },
  });

  if (!existing) {
    throw AppError("Order not found", 404);
  }

  const order = await prisma.order.update({
    where: { id },
    data: {
      orderNumber,
      status,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      userId: userId === undefined ? undefined : Number(userId),
      addressId: addressId === undefined ? undefined : Number(addressId),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      address: true,
      items: {
        include: {
          product: true,
        },
      },
      payment: true,
    },
  });

  res.json({
    success: true,
    data: order,
  });
});

const deleteOrder = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);

  const existing = await prisma.order.findUnique({
    where: { id },
  });

  if (!existing) {
    throw AppError("Order not found", 404);
  }

  await prisma.order.delete({
    where: { id },
  });

  res.json({
    success: true,
    data: existing,
  });
});

export {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
