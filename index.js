import express from 'express';
import "dotenv/config";
const app = express();
const PORT = process.env.PORT || 3000;
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';


app.use(express.json());
app.use("/api", [categoryRoutes,productRoutes]);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
