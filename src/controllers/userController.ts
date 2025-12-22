import type { NextFunction, Request, Response } from "express"
import User from "../models/userModel.ts";
import bcrypt from "bcryptjs";
import { Role } from "../models/roleModel.ts";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, roleId } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const checkUserData = await User.findOne({ email: email });

        if (checkUserData) {
            res.status(400).json({ message: "User already exists!" });
        }

        const role = await Role.findOne({ _id: roleId });

        console.log(role);

        if (!role) {
            return res.status(400).json({ message: "Role does not exists!" });
        }

        const user = new User({
            name,
            email,
            password: hashPassword,
            roleId
        });

        await user.save();

        res.status(201).json({ message: "User created successfully", user: user });
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id, name, email } = req.body;

        let user = await User.findOne({ _id: id });

        if (!user) {
            res.status(400).json({ message: "User does not exists!" });
        }

        user = await User.findByIdAndUpdate(id, {
            name,
            email
        }, { new: true })

        res.status(200).json({ message: "User updated successfully", user: user });
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
            res.status(400).json({ message: "User does not exists!" });
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