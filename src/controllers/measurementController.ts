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
    // ユーザー名に紐づく計測データを取得する
    console.log(req.user?.name);
    const measurement = await Measurement.find({ userName: req.user?.name });
    if (!measurement) {
      return next(new ErrorResponse("No data found", 404));
    }
    // 計測データを返す
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
    // 最新の計測データを取得する
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
// 計測データを保存する
export const postMeasurement = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userName = req.user?.name;
    console.log(userName);
    // 計測データを生成する
    const measurement = new Measurement({
      userName: userName,
      bookId: req.params.bookId,
      isCal: false,
    });

    console.log(measurement.userName);
    console.log(measurement.bookId);
    measurement.generateMeasurementId();

    const emotionData = req.body;
    // 計測データがある場合は感情データを保存する
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
    // 計測データを保存する
    await measurement.save();
    res.status(201).json({ success: true, data: measurement });
  } catch (error: any) {
    next(new ErrorResponse(error.message, 500));
  }
};
