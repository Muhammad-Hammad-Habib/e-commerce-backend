import prisma from "../lib/prisma.js";
import {
  AppError,
  parseId,
  asyncHandler,
} from "../middleware/error.middleware.js";

const createPayment = asyncHandler(async (req, res) => {
  const { method, status, amount, orderId } = req.body;

  if (!method || amount === undefined || !orderId) {
    throw AppError("method, amount, and orderId are required", 400);
  }

  const payment = await prisma.payment.create({
    data: {
      method,
      status,
      amount,
      orderId: Number(orderId),
    },
    include: {
      order: true,
    },
  });

  res.status(201).json({
    success: true,
    data: payment,
  });
});

const getPayments = asyncHandler(async (req, res) => {
  const payments = await prisma.payment.findMany({
    include: {
      order: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  res.json({
    success: true,
    data: payments,
  });
});

const getPaymentById = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);

  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      order: true,
    },
  });

  if (!payment) {
    throw AppError("Payment not found", 404);
  }

  res.json({
    success: true,
    data: payment,
  });
});

const updatePayment = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const { method, status, amount, orderId } = req.body;

  const existing = await prisma.payment.findUnique({
    where: { id },
  });

  if (!existing) {
    throw AppError("Payment not found", 404);
  }

  const payment = await prisma.payment.update({
    where: { id },
    data: {
      method,
      status,
      amount,
      orderId: orderId === undefined ? undefined : Number(orderId),
    },
    include: {
      order: true,
    },
  });

  res.json({
    success: true,
    data: payment,
  });
});

const deletePayment = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);

  const existing = await prisma.payment.findUnique({
    where: { id },
  });

  if (!existing) {
    throw AppError("Payment not found", 404);
  }

  await prisma.payment.delete({
    where: { id },
  });

  res.json({
    success: true,
    data: existing,
  });
});

export {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};
