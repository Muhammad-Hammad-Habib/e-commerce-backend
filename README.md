# Kacha Papar Backend

Initial backend foundation for the Kacha Papar e-commerce API.

This project uses **ES modules** (`"type": "module"`), Express, Prisma, PostgreSQL, Multer, and Cloudinary.

## Start the server

```bash
npm install
npx prisma generate
npm run dev
```

The API runs at `http://localhost:3000`.

## Database commands

```bash
npx prisma format
npx prisma validate
npx prisma migrate dev --name initial_schema
npx prisma generate
npx prisma db seed
```

## Environment variables

Copy `.env.example` to `.env` and fill in your values:

- `PORT`
- `DATABASE_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
