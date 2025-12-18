import { Router, type Request, type Response } from "express";
import User from "../models/userModel.ts";
import { createUser, getUser } from "../controllers/userController.ts";

const router = Router();

router.post("/", createUser);
router.get("/get", getUser);

export default router;
