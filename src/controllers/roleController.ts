import type { Request, Response } from "express";
import { Role } from "../models/roleModel.ts";
import { Permission } from "../models/permissionModel.ts";

export const createRole = async (req: Request, res: Response) => {
    try {
        const { name, permissionIds } = req.body;

        const roleData = await Role.findOne({ name: name });

        if (roleData) {
            res.status(400).json({ message: "role already exists!" });
        }

        const permission: boolean = await permissionIds.map(async (permission: string) => {
            const isExists = await Permission.findOne({ permission });

            if (!isExists) {
                return false;
            }

            return true;
        });

        if (!permission) {
            res.status(400).json({ message: "Permission does not exists in database" });
        }

        const role = new Role({
            name,
            permissionsIds: permissionIds
        });

        await role.save();

        res.status(201).json({ message: "Role created successfully.", role: role});
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}

export const updateRole = async (req: Request, res: Response) => {
    try {

    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}

export const deleteRole = async (req: Request, res: Response) => {
    try {

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