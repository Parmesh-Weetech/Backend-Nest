import express from 'express';
import { createRole, updateRole, getAllRole, getRoleById, deleteRole } from '../controllers/roleController.ts';

const router = express.Router();

router.post("/create", createRole);
router.put("/update", updateRole);
router.delete("/delete/:id", deleteRole);
router.get("/get/all", getAllRole);
router.get("/get/:id", getRoleById);

export default router;