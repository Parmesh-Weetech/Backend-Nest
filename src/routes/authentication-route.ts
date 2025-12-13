import express from 'express';
const router = express.Router();
import { APIResponseClass } from '../models/authentication-model.ts';
import { authenticationMiddleware } from '../middlewares/authentication-middleware.ts';


// router.get("/public", authenticationMiddleware({
//     url: "/admin",
//     headers: {
//         authorization: "Bearer token",
//     },
//     role: "admin",
// }, APIResponseClass), (req, res) => {
//     res.send("Public route - no authentication required");
// })

router.get("/private", (req, res) => {
    res.send("Private route - authentication required");
});

router.post("/admin", (req, res) => {
    res.send("Admin route - admin privileges required");
});

export default router;