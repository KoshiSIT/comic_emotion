import mongoose, { Document, Model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  getSignedToken(): string;
}

const userSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      "Please use a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});
userSchema.methods.getSignedToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE!,
  });
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
