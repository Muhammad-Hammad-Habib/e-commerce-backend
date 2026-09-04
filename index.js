import "dotenv/config";
import express from "express";
import categoryRouter from "./routes/category.routes.js";
import productRouter from "./routes/product.routes.js";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);

app.use((error, _request, response, _next) => {
  console.error(error);
  const status = Number.isInteger(error?.status) && error.status >= 400 ? error.status : 500;
  response.status(status).json({
    error: status === 500 ? "Internal server error" : error.message,
  });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
}

export default app;