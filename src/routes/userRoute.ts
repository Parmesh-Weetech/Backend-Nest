import express from "express";
import { updateUser, deleteUser, getAllUser, getUserById } from "../controllers/userController.ts";
import { register } from "../controllers/authController.ts";

const router = express.Router();

router.post("/create", register);
router.put("/update", updateUser);
router.delete('/delete/:id', deleteUser);
router.get("/all", getAllUser);
router.get("/:id", getUserById);

export default router;