import express from 'express';
import { createPermission, updatePermission, getAllPermission, getPermissionById, deletePermission } from '../controllers/permissionController.ts';

const router = express.Router();

router.post("/create", createPermission);
router.put("/update", updatePermission);
router.delete("/delete/:id", deletePermission);
router.get("/all", getAllPermission);
router.get("/:id", getPermissionById);

export default router;