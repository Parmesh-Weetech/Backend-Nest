import type { Request, Response } from "express";
import { Permission } from "../models/permissionModel.ts";

export const createPermission = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        const permission = await Permission.findOne({ name });

        if(permission) {
            res.status(400).json({ message: "Permission already exists!"});
        }

        const newPermission = new Permission({
            name: name
        })

        await newPermission.save();

        res.status(200).json({ message: "Permission Created Successfully.", permission: permission });
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}

export const updatePermission = async (req: Request, res: Response) => {
    try {

    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}

export const deletePermission = async (req: Request, res: Response) => {
    try {

    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}

export const getAllPermission = async (req: Request, res: Response) => {
    try {

    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}

export const getPermissionById = async (req: Request, res: Response) => {
    try {

    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}