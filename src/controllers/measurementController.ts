import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Measurement from "../models/measurement";
import EmotionData from "../models/emotionData";
import ErrorResponse from "../utils/errorResponse";
import { saveEmotion } from "./emotionDataController";
// test ok
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
// test ok
export const getMeasurementByUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.user?.name);
    const measurement = await Measurement.find({ userName: req.user?.name });
    if (!measurement) {
      return next(new ErrorResponse("No data found", 404));
    }
    res.status(200).json({ success: true, data: measurement });
  } catch (error: any) {
    next(new ErrorResponse(error.message, 500));
  }
};
// test ok
export const getMeasurementLatestByUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const measurement = await Measurement.findOne({
      userName: req.user?.name,
    }).sort({ startTime: -1 });
    if (!measurement) {
      return next(new ErrorResponse("No data found", 404));
    }
    res.status(200).json({ success: true, data: measurement });
  } catch (error: any) {
    next(new ErrorResponse(error.message, 500));
  }
};
// test ok
export const postMeasurement = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userName = req.user?.name;
    console.log(userName);
    const measurement = new Measurement({
      userName: userName,
      bookId: req.params.bookId,
    });

    console.log(measurement.userName);
    console.log(measurement.bookId);
    measurement.generateMeasurementId();

    const emotionData = req.body;

    if (Array.isArray(emotionData) && emotionData.length > 0) {
      try {
        await Promise.all(
          emotionData.map((data) => saveEmotion(measurement, data))
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
