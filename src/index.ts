import "dotenv/config";
import express from "express";
import path from "path";
import fs from 'fs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from "connect-mongo";
import { v4 as genuuid } from "uuid";
import helmet from "helmet";
import morgan from 'morgan';

import { connectMongo } from './config/mongo.ts';

import postRoute from './routes/postRoute.ts';
import authRoute from './routes/authRoute.ts';
import userRoute from './routes/userRoute.ts';
import roleRoute from './routes/roleRoute.ts';
import fileRoute from './routes/fileRoute.ts';
import permissionRoute from './routes/permissionRoute.ts';

import { checkRole, isAuthenticated } from "./middlewares/authMiddleware.ts";

import { csrfSynchronisedProtection } from "./utils/csrf.ts";
import { upload } from "./utils/file.ts";
import { fstat } from "fs";

const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = path.resolve();

const startServer = async () => {
    await connectMongo().catch((err) => {
        console.error("❌ Startup error:", err);
        process.exit(1);
    });;
};

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: "a"});

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan('tiny', { stream: accessLogStream }));

app.use(session({
    name: "authId",
    genid: function (req) {
        return genuuid();
    },
    secret: "fba0c4c9ad888210",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 300000,
        httpOnly: true
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI!,
        collectionName: "sessions",
        ttl: 300000
    })
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/auth", authRoute);
app.use("/file", upload.single("avatar"), fileRoute);
app.get("/server", (req, res) => {
    res.status(200).json({ message: "Server response "})
})

app.use(csrfSynchronisedProtection);

app.use("/post", isAuthenticated, checkRole, postRoute);
app.use("/admin/user", isAuthenticated, checkRole, userRoute);
app.use("/admin/roles", isAuthenticated, checkRole, roleRoute);
app.use("/admin/permissions", isAuthenticated, checkRole, permissionRoute);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

startServer();
