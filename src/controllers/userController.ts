import type { Request, Response } from "express";
import User from "../models/userModel.ts";

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;
        let user = new User({ name, email });
        await user.save();

        res.status(201).json({ message: "User created" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Insert failed" });
    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        let user = await User.find()

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Insert failed" });
    }
}