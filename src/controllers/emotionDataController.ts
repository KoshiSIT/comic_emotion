import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import EmotionData from "../models/emotionData";
import ErrorResponse from "../utils/errorResponse";

export const getEmotionAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const emotionData = await EmotionData.find();
    res.status(200).json({ success: true, data: emotionData });
  } catch (error: any) {
    next(new ErrorResponse(error.message, 500));
  }
};

export const getEmotionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const emotionData = await EmotionData.findById(req.params.id);
    if (!emotionData) {
      return next(new ErrorResponse("No data found", 404));
    }
    res.status(200).json({ success: true, data: emotionData });
  } catch (error: any) {
    next(new ErrorResponse(error.message, 500));
  }
};

export const saveEmotion = async (measurementId: String, data: object) => {
  try {
    const emotionData = new EmotionData({
      measurementId,
      ...data,
    });
    await emotionData.save();
    return emotionData;
  } catch (error: any) {
    throw new ErrorResponse(error.message, 500);
  }
};
