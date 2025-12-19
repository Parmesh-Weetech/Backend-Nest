import type { Request, Response } from "express";
import { generateRandomString } from "../util/randomStringUtil.ts";
import User from "../models/userModel.ts";
import bcrypt from "bcryptjs";
import { generateToken } from "../util/csrf.ts";

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

        const token = generateRandomString(8);
        const csrfToken = generateToken(req);

        req.session._csrfToken = req.session.csrfToken

        req.session.userId = userData?._id;
        req.session.authId = token;

        res.status(200).json({ message: "User Login Successful", sessionId: req.sessionID, csrfToken: csrfToken })
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

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = new User({ name: name, email: email, password: hashPassword });
        await user.save();

        res.status(201).json({ message: "User Registered Successfully", user: user });

    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}

