import express from "express";
import { createPost, deletePost, getAllPost, getPostById, updatePost } from "../controllers/postController.ts";

const router = express.Router();

router.post("/create", createPost);
router.put("/update", updatePost);
router.delete("/delete", deletePost);
router.get("/all", getAllPost);
router.get("/:id", getPostById);

export default router;