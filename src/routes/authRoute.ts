import express from "express";
import { login, register, reset, resetPassword } from "../controllers/authController.ts";
import { validate } from "../middlewares/validation.ts";
import { body } from "express-validator";

const router = express.Router();

router.post("/login",
    [
        body('email')
            .normalizeEmail()
            .isEmail()
            .withMessage("Invalid Email Address")
            .notEmpty()
            .withMessage("Email cannot be empty"),
        body('password')
            .trim()
            .isLength({ min: 6, max: 6 })
            .withMessage("Password must have length of 6")
            .isAlphanumeric()
            .withMessage("Password must contain only alphanumeric characters'")
            .notEmpty()
            .withMessage("Password Cannot Empty")
    ],
    validate,
    login);
router.post("/register",
    [
        body('name')
            .notEmpty()
            .withMessage("Name cannot empty"),
        body('email')
            .notEmpty()
            .withMessage("Email cannot be empty")
            .normalizeEmail()
            .isEmail()
            .withMessage("Invalid Email Address"),
        body('password')
            .trim()
            .notEmpty()
            .withMessage("Password Cannot Empty")
            .isLength({ min: 6, max: 6 })
            .withMessage("Password must have length of 6")
            .isAlphanumeric()
            .withMessage("Password must contain only alphanumeric characters'")
    ],
    validate,
    register)
router.post("/reset", reset)
router.post("/reset/:token", resetPassword)

export default router;