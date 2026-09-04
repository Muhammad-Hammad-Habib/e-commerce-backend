import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/", async (request, response) => {
  const products = await prisma.product.findMany({
    where: {
      ...(request.query.includeInactive === "true" ? {} : { isActive: true }),
      ...(typeof request.query.categoryId === "string"
        ? { categoryId: request.query.categoryId }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  response.json(products);
});

router.get("/:id", async (request, response) => {
  const product = await prisma.product.findUnique({
    where: { id: request.params.id },
    include: { category: true },
  });

  if (!product || (!product.isActive && request.query.includeInactive !== "true")) {
    response.status(404).json({ error: "Product not found" });
    return;
  }

  response.json(product);
});

router.post("/", async (request, response) => {
  const { name, slug, description, price, stock, categoryId } = request.body ?? {};
  const parsedPrice = Number(price);
  const parsedStock = stock === undefined ? 0 : Number(stock);

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof slug !== "string" ||
    !slug.trim() ||
    !Number.isFinite(parsedPrice) ||
    parsedPrice < 0 ||
    !Number.isInteger(parsedStock) ||
    parsedStock < 0 ||
    typeof categoryId !== "string" ||
    !categoryId
  ) {
    response.status(400).json({
      error: "name, slug, non-negative price, non-negative integer stock, and categoryId are required",
    });
    return;
  }

  try {
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: typeof description === "string" ? description.trim() || null : null,
        price: parsedPrice,
        stock: parsedStock,
        categoryId,
      },
    });
    response.status(201).json(product);
  } catch (error) {
    if (error?.code === "P2002") {
      response.status(409).json({ error: "Product slug already exists" });
      return;
    }
    if (error?.code === "P2003") {
      response.status(400).json({ error: "Category not found" });
      return;
    }
    throw error;
  }
});

export default router;
