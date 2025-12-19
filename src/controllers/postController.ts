import type { Request, Response } from "express";
import Post from "../models/postModel.ts";

export const createPost = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;

        const { name, bio } = req.body;

        const post = new Post({
            name: name,
            bio: bio,
            userId: userId
        })

        await post.save();

        res.status(201).json({ message: "Post is created", post: post});

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error"})
    }
}

export const updatePost = (req: Request, res: Response) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const deletePost = (req: Request, res: Response) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getAllPost = (req: Request, res: Response) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getPostById = (req: Request, res: Response) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}