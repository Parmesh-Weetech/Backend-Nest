import express from 'express';
import { createPermission, updatePermission, getAllPermission, getPermissionById, deletePermission } from '../controllers/permissionController.ts';

const router = express.Router();

router.post("/create", createPermission);
router.put("/update", updatePermission);
router.delete("/delete/:id", deletePermission);
router.get("/get/all", getAllPermission);
router.get("/get/:id", getPermissionById);

export default router;