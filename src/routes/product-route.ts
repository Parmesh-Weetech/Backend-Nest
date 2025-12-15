import express from "express";
import fs from "fs";
import path from "path";

import { type Product } from "../models/Product.ts";

const router = express.Router();

router.get("/all", (req, res) => {
    res.send("Product List");
});

router.post("/add", (req, res) => {
    const { name, description, price } = req.body;

    const newProduct: Product = {
        id: Math.random() + Date.now(),
        name,
        description,
        price,
    };

    const filePath = path.join(process.cwd(), "src/data/products.json");
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
        console.log("products.json did not exist, created with an empty array.");
    }


    const data = fs.readFileSync("src/data/products.json", "utf-8");
    const products: Product[] = JSON.parse(data);

    products.push(newProduct);

    fs.writeFileSync("src/data/products.json", JSON.stringify(products, null, 2));
    res.send({ message: "Product Added", product: newProduct });
});

router.post("/update/:id", (req, res) => {
    res.send("Update Product " + req.params.id);
});

router.post("/delete/:id", (req, res) => {
    res.send("Delete Product " + req.params.id);
});

router.post("/:id", (req, res) => {
    res.send(`Get Product with ID: ${req.params.id}`);
});

export default router;