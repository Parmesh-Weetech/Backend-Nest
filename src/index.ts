import express from 'express';
import productRoute from './routes/product-route.ts';

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/products", productRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});