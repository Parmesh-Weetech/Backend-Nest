import type { Request, Response } from "express";
import Post from "../models/postModel.ts";
import { Role } from "../models/roleModel.ts";

export const createPost = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;

        const { name, bio } = req.body;

        const post = new Post({
            name,
            bio,
            userId
        })

        await post.save();

        res.status(201).json({ message: "Post is created", post: post});

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error"})
    }
}

export const updatePost = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;
        const roleId = req.session.roleId;

        const { id, name, bio } = req.body;
        let post;

        const role = await Role.findOne({ _id: roleId });

        if(role?.name === "ADMIN" || role?.name === "SYSTEM") {
            post = await Post.findOne({ _id: id });
        } else {
            post = await Post.findOne({ userId: userId, _id: id });
        }

        if(!post) {
            res.status(400).json({ message: "Unauthorized Request!"});
        }

        await Post.findByIdAndUpdate(id, {
            name: name,
            bio: bio
        });

        res.status(200).json({ message: "Post Updated Successfully."});
    } catch (error) { 
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const deletePost = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        await Post.findByIdAndDelete(id);

        res.status(200).json({ message: "Post Deleted Successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getAllPost = async (req: Request, res: Response) => {
    try {
        const ITEMS_PER_PAGE = 2;
        const userId = req.session.userId;
        const page: number = Number(req.query.page) || 1;

        const posts = await Post.find({ userId: userId }).skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);

        res.status(200).send(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getPostById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const post = await Post.findById(id);

        res.status(200).json({ post: post });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}