import express from 'express';
import dotenv from 'dotenv';
import dbConnect from './config/db.ts';
import { User } from './models/Product.ts';

dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

User.sync({ alter: true });

app.get("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    await User.create({
      name: name,
      email: email
    })
    
    res.status(201).json({ message: "User Created" })
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
});

app.listen(PORT, () => {
  dbConnect();
  console.log(`Server is running on http://localhost:${PORT}`);
});