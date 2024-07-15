import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Measurement from "../models/measurement";
import EmotionData from "../models/emotionData";
import ErrorResponse from "../utils/errorResponse";
import { saveEmotion } from "./emotionDataController";

export const getMeasurementAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const measurement = await Measurement.find();
    res.status(200).json({ success: true, data: measurement });
  } catch (error: any) {
    next(new ErrorResponse(error.message, 500));
  }
};

export const getMeasurementByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const measurement = await Measurement.find({ userId: req.params.userId });
    if (!measurement) {
      return next(new ErrorResponse("No data found", 404));
    }
    res.status(200).json({ success: true, data: measurement });
  } catch (error: any) {
    next(new ErrorResponse(error.message, 500));
  }
};

export const getMeasurementLatestByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const measurement = await Measurement.findOne({
      userId: req.params.userId,
    }).sort({ startTime: -1 });
    if (!measurement) {
      return next(new ErrorResponse("No data found", 404));
    }
    res.status(200).json({ success: true, data: measurement });
  } catch (error: any) {
    next(new ErrorResponse(error.message, 500));
  }
};

export const postMeasurement = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const measurement = new Measurement({
      userName: req.user?.name,
      mangaTitle: req.params.mangaTitle,
    });
    const emotionData = req.body;

    if (Array.isArray(emotionData) && emotionData.length > 0) {
      try {
        await Promise.all(
          emotionData.map((data) =>
            saveEmotion(measurement.measurementId, data)
          )
        );
      } catch (error: any) {
        return next(
          new ErrorResponse(
            `Failed to save emotion data: ${error.message}`,
            500
          )
        );
      }
    }
    await measurement.save();
    res.status(201).json({ success: true, data: measurement });
  } catch (error: any) {
    next(new ErrorResponse(error.message, 500));
  }
};
