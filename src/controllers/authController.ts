import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import ErrorResponse from "../utils/errorResponse";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });

    const token = user.getSignedToken();
    res.status(201).json({ success: true, token });
  } catch (error: any) {
    next(new ErrorResponse(error.message, 500));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  try {
    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    const token = user.getSignedToken();
    res.status(200).json({ success: true, token });
  } catch (error: any) {
    next(new ErrorResponse(error.message, 500));
  }
};
