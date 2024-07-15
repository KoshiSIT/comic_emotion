import express from "express";
import { Router } from "express";
import User from "../models/user";
import { register, login } from "../controllers/authController";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.post("/register", register);
router.get("/login", login);

const authRouter = router;

export default authRouter;
