import express from "express";
import { saveFile, getFile, deleteFile } from "../controllers/fileController.ts";

const router = express.Router();

router.get("/upload", saveFile);
router.get("/:id", getFile);
router.delete("/:id", deleteFile)

export default router;