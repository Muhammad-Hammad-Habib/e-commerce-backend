import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const pipePapad = await prisma.category.upsert({
    where: { slug: "pipe-papad" },
    update: {},
    create: {
      name: "Pipe Papad",
      slug: "pipe-papad",
      description: "Traditional pipe-shaped papad",
    },
  });

  const ringPapad = await prisma.category.upsert({
    where: { slug: "ring-papad" },
    update: {},
    create: {
      name: "Ring Papad",
      slug: "ring-papad",
      description: "Crispy ring-shaped papad",
    },
  });

  const slantyPapad = await prisma.category.upsert({
    where: { slug: "slanty-papad" },
    update: {},
    create: {
      name: "Slanty Papad",
      slug: "slanty-papad",
      description: "Crunchy slanty papad snacks",
    },
  });

  await prisma.product.upsert({
    where: { slug: "demo-pipe-papad" },
    update: {},
    create: {
      name: "Demo Pipe Papad",
      slug: "demo-pipe-papad",
      description: "Demo product for Pipe Papad",
      price: 250,
      stock: 50,
      isActive: true,
      categoryId: pipePapad.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "demo-ring-papad" },
    update: {},
    create: {
      name: "Demo Ring Papad",
      slug: "demo-ring-papad",
      description: "Demo product for Ring Papad",
      price: 280,
      stock: 40,
      isActive: true,
      categoryId: ringPapad.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "demo-slanty-papad" },
    update: {},
    create: {
      name: "Demo Slanty Papad",
      slug: "demo-slanty-papad",
      description: "Demo product for Slanty Papad",
      price: 220,
      stock: 60,
      isActive: true,
      categoryId: slantyPapad.id,
    },
  });

  console.log("Seed data created successfully");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
