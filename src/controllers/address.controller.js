import prisma from "../lib/prisma.js";
import {
  AppError,
  parseId,
  asyncHandler,
} from "../middleware/error.middleware.js";

const createAddress = asyncHandler(async (req, res) => {
  const { fullName, phone, addressLine, city, province, postalCode, userId } =
    req.body;

  if (!fullName || !phone || !addressLine || !city || !userId) {
    throw AppError(
      "fullName, phone, addressLine, city, and userId are required",
      400,
    );
  }

  const address = await prisma.address.create({
    data: {
      fullName,
      phone,
      addressLine,
      city,
      province,
      postalCode,
      userId: Number(userId),
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
    },
  });

  res.status(201).json({
    success: true,
    data: address,
  });
});

const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await prisma.address.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  res.json({
    success: true,
    data: addresses,
  });
});

const getAddressById = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);

  const address = await prisma.address.findUnique({
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
    },
  });

  if (!address) {
    throw AppError("Address not found", 404);
  }

  res.json({
    success: true,
    data: address,
  });
});

const updateAddress = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const { fullName, phone, addressLine, city, province, postalCode, userId } =
    req.body;

  const existing = await prisma.address.findUnique({
    where: { id },
  });

  if (!existing) {
    throw AppError("Address not found", 404);
  }

  const address = await prisma.address.update({
    where: { id },
    data: {
      fullName,
      phone,
      addressLine,
      city,
      province,
      postalCode,
      userId: userId === undefined ? undefined : Number(userId),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  res.json({
    success: true,
    data: address,
  });
});

const deleteAddress = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);

  const existing = await prisma.address.findUnique({
    where: { id },
  });

  if (!existing) {
    throw AppError("Address not found", 404);
  }

  await prisma.address.delete({
    where: { id },
  });

  res.json({
    success: true,
    data: existing,
  });
});

export {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};
