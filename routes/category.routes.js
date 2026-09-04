import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/", async (_request, response) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  response.json(categories);
});

router.get("/:id", async (request, response) => {
  const category = await prisma.category.findUnique({
    where: { id: request.params.id },
    include: { products: { where: { isActive: true } } },
  });

  if (!category) {
    response.status(404).json({ error: "Category not found" });
    return;
  }

  response.json(category);
});

router.post("/", async (request, response) => {
  const name = typeof request.body?.name === "string" ? request.body.name.trim() : "";

  if (!name) {
    response.status(400).json({ error: "name is required" });
    return;
  }

  try {
    const category = await prisma.category.create({ data: { name } });
    response.status(201).json(category);
  } catch (error) {
    if (error?.code === "P2002") {
      response.status(409).json({ error: "Category name already exists" });
      return;
    }
    throw error;
  }
});

router.patch("/:id", async (request, response) => {
  const name = typeof request.body?.name === "string" ? request.body.name.trim() : "";

  if (!name) {
    response.status(400).json({ error: "name is required" });
    return;
  }

  try {
    const category = await prisma.category.update({
      where: { id: request.params.id },
      data: { name },
    });
    response.json(category);
  } catch (error) {
    if (error?.code === "P2025") {
      response.status(404).json({ error: "Category not found" });
      return;
    }
    if (error?.code === "P2002") {
      response.status(409).json({ error: "Category name already exists" });
      return;
    }
    throw error;
  }
});

router.delete("/:id", async (request, response) => {
  try {
    await prisma.category.delete({ where: { id: request.params.id } });
    response.status(204).send();
  } catch (error) {
    if (error?.code === "P2025") {
      response.status(404).json({ error: "Category not found" });
      return;
    }
    if (error?.code === "P2003") {
      response.status(409).json({ error: "Category has products and cannot be deleted" });
      return;
    }
    throw error;
  }
});

export default router;
