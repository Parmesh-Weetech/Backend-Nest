import type { Request, Response } from "express";
import { Role } from "../models/roleModel.ts";
import { Permission } from "../models/permissionModel.ts";
import User from "../models/userModel.ts";

export const createRole = async (req: Request, res: Response) => {
    try {
        const { name, permissionIds } = req.body;

        const roleData = await Role.findOne({ name: name });

        if (roleData) {
            res.status(400).json({ message: "role already exists!" });
        }

        const permission: boolean = await permissionIds.map(async (permissionId: string) => {
            const permissionData = await Permission.findOne({ _id: permissionId });

            if (!permissionData) {
                return false;
            }

            return true;
        });

        if (!permission) {
            res.status(400).json({ message: `Permission does not exists in database` });
        }

        const role = new Role({
            name,
            permissionsIds: permissionIds
        });

        await role.save();

        res.status(201).json({ message: "Role created successfully.", role: role });
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}

export const updateRole = async (req: Request, res: Response) => {
    try {
        const { id, name, permissionIds } = req.body;

        const permission: boolean = await permissionIds.map(async (permissionId: string) => {
            const permissionData = await Permission.findOne({ _id: permissionId });

            if (!permissionData) {
                return false;
            }

            return true;
        });

        if (!permission) {
            res.status(400).json({ message: `One / Many Permissions does not exists in database.` });
        }

        const newRole = Role.findByIdAndUpdate(id, {
            name,
            permissionIds: permissionIds
        }, {
            new: true
        })

        res.status(200).json({ message: "Role updated successfully", role: newRole });
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}

export const deleteRole = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        if (!id) {
            res.status(400).json({ message: "Role id is required in order to perform this action " });
        }

        const role = await Role.findOne({ _id: id });

        if (!role) {
            res.status(400).json({ message: "Role doesn't exists in database" });
        }

        role?.permissionsIds.map(async (permissionId) => {
            await Permission.findByIdAndDelete(permissionId);
        })

        await Role.findByIdAndDelete(id);

        const users = await User.find({ roleId: id! });

        users.map(async (user) => {
            await User.findByIdAndUpdate(user._id, {
                roleId: null
            })
        })

        res.status(200).json({ message: "Role deleted successfully " });
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}

export const getAllRole = async (req: Request, res: Response) => {
    try {

    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}

export const getRoleById = async (req: Request, res: Response) => {
    try {

    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}