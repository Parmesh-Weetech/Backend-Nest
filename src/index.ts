import "dotenv/config";
import express from "express";
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { csrfSync } from "csrf-sync";
import { v4 as genuuid } from "uuid";
import { connectMongo } from "./config/mongo.ts";
import postRoute from './routes/postRoute.ts'
import authRoute from './routes/authRoute.ts'
import MongoStore from "connect-mongo";
import { isAuthenticated } from "./middlewares/authMiddleware.ts";
import { csrfSynchronisedProtection, generateToken } from "./util/csrf.ts";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(session({
    name: "authId",
    genid: function (req) {
        return genuuid();
    },
    secret: "fba0c4c9ad888210",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000,
        httpOnly: true
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI!,
        collectionName: "sessions",
        ttl: 60000
    })
}));
app.use("/auth", authRoute);
app.use(csrfSynchronisedProtection);

const PORT = process.env.PORT || 3001;

const startServer = async () => {
    await connectMongo().catch((err) => {
        console.error("❌ Startup error:", err);
        process.exit(1);
    });;
};

app.use("/post", isAuthenticated, postRoute);
app.get("/csrf-token", (req, res) => {
    const token = generateToken(req);
    res.json({ csrfToken: token });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

startServer();
