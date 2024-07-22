import jws from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { IUser } from "../models/user";

export interface AuthRequest extends Request {
  user?: IUser;
}

interface DecodedJwt {
  id: string;
  iat: number;
  exp: number;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  let token: string | undefined;

  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized to access this route" });
  }

  try {
    const decoded = jws.verify(token, process.env.JWT_SECRET!) as DecodedJwt;
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "No user found with this id" });
    }
    req.user = user;
    next();
  } catch (error: any) {
    return res
      .status(401)
      .json({ message: "Not authorized to access this route" });
  }
};

export const authorize = (...permissions: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (
      !req.user ||
      !req.user.permissions ||
      !permissions.some((permission) =>
        req.user?.permissions.includes(permission)
      )
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this route" });
    }
    next();
  };
};
