import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;
import categoryRoutes from './routes/category.routes.js';


app.use(express.json());
app.use("/api", categoryRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
