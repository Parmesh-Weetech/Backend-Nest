import type { Request, Response } from "express";
import { generateRandomString } from "../utils/randomStringUtil.ts";
import User from "../models/userModel.ts";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/csrf.ts";
import crypto from 'crypto';
// import nodemailer from "nodemailer";
import Reset from "../models/resetModel.ts";
import { Permission } from "../models/permissionModel.ts";
import { Role } from "../models/roleModel.ts";

// const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST, 
//     port: process.env.SMTP_PORT,
//     secure: process.env.SMTP_SECURE,
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASSWORD // need to set the password of app password from account
//     }
// })

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const userData = await User.findOne({ email });

        if (!userData) {
            res.status(400).json({ message: "User is not exists" });
            return;
        }

        const isValid = await bcrypt.compare(password, userData.password)

        if (!isValid) {
            res.status(401).json({ message: "Invalid Credentials" });
            return;
        }

        const csrfToken = generateToken(req);

        req.session._csrfToken = req.session.csrfToken

        req.session.userId = userData._id;
        req.session.roleId = userData.roleId;

        const role = await Role.findOne({ _id: userData.roleId });

        if (!role) {
            res.status(403).json({ message: "Unauthorized access!" });
        }

        res.status(200).json({ message: "User Login Successful", sessionId: req.sessionID, roleId: userData.roleId, csrfToken: csrfToken })
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const userData = await User.findOne({ email });

        if (userData) {
            res.status(403).json({ message: "User already exists" });
        }

        const permission = new Permission({
            name: "ALL"
        })

        await permission.save();

        const role = new Role({
            name: "SYSTEM",
            permissionsIds: [permission._id]
        })

        await role.save();

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = new User({ name: name, email: email, password: hashPassword, roleId: role._id });
        await user.save();

        // transporter.sendMail(transporter, async (error, info) => {
        //     if(error) {
        //         console.log(error.message)
        //         await User.deleteOne({ id: user._id });
        //         res.status(500).json({ message: "Internal Server Error!"})
        //     } else {
        //         res.status(201).json({ message: "User Registered Successfully", user: user });
        //     }
        // })

        // res.status(500).json({ message: "Internal Server Error!" })
        res.status(201).json({ message: "User Registered Successfully", user: user });
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}

export const reset = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            res.status(400).json({ message: "Unathorized access! User not exists." });
        }

        const token = crypto.randomBytes(32).toString("hex");

        const reset = new Reset({
            resetLink: token,
            resetTime: Date.now() + 600000,
            userId: user!._id
        })

        await reset.save();

        res.status(201).json({ message: "Reset Link Generated", resetLink: token });
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const token = req.params.token;
        const { email, password } = req.body;

        if (!token) {
            res.status(400).json({ message: "Token is required" });
            return;
        }

        const reset = await Reset.findOne({ resetLink: token, resetTime: { $gt: Date.now() } });

        if (!reset) {
            res.status(400).json({ message: "Invalid Request" });
        }

        const genSalt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, genSalt);

        let user = await User.findOne({ email: email });

        if (!user) {
            res.status(400).json({ message: "Unauthorized access! User not exists" })
        }

        user = await User.findByIdAndUpdate(user!._id, {
            password: hashPassword
        })

        await Reset.deleteOne({ id: reset!._id });

        res.status(200).json({ message: "Password Reset Successfully." });
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}