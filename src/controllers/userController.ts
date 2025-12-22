import type { Request, Response } from "express"
import User from "../models/userModel.ts";

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id, name, email } = req.body;

        let user = await User.findOne({ _id: id });

        if(!user) {
            res.status(400).json({ message: "User does not exists!"});
        }

        user = await User.findByIdAndUpdate(id, {
            name,
            email
        }, { new: true })

        res.status(200).json({ message: "User updated successfully", user: user});
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const user = await User.findOne({ _id: id });

        if (!user) {
            res.status(400).json({ message: "User does not exists!"});
        }

        await User.findByIdAndDelete(id);
        
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}

export const getAllUser = async (req: Request, res: Response) => {
    try {
        const user = await User.find();

        res.status(200).send(user);
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const user = await User.findById(id);

        res.status(200).send(user);
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}