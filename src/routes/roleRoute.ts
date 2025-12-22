import express from 'express';
import { createRole, updateRole, getAllRole, getRoleById, deleteRole } from '../controllers/roleController.ts';

const router = express.Router();

router.post("/create", createRole);
router.put("/update", updateRole);
router.delete("/delete/:id", deleteRole);
router.get("/all", getAllRole);
router.get("/:id", getRoleById);

export default router;