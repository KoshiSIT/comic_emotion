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

export const saveEmotion = async (measurement: any, data: object) => {
  console.log(measurement.measurementId);
  console.log(data);
  const cData = castEmotionData(data);
  try {
    const emotionData = new EmotionData({
      measurementId: measurement.measurementId,
      ...cData,
    });
    await emotionData.save();
    return emotionData;
  } catch (error: any) {
    throw new ErrorResponse(error.message, 500);
  }
};

const castEmotionData = (data: any) => {
  interface IEmotionData {
    timestamp: Date;
    theta: number;
    delta: number;
    attention: number;
    meditation: number;
    low_alpha: number;
    high_alpha: number;
    low_beta: number;
    high_beta: number;
    low_gamma: number;
    mid_gamma: number;
    poor_signal: number;
    blink_strength: number;
    IBI: number;
    BPM: number;
    SDNN_over_RMSSD: number;
    CVNN: number;
    SDNN: number;
    RMSSD: number;
    pNN10: number;
    pNN20: number;
    pNN30: number;
    pNN40: number;
    pNN50: number;
    LF: number;
    HF: number;
    LF_over_HF: number;
    stimu_num: number;
    event: string;
  }
  //  timestamp: '2023-07-12_17:39:34.494798',
  const isoTimestamp = data.timestamp.replace("_", "T");
  const timestamp = new Date(isoTimestamp);

  if (isNaN(timestamp.getTime())) {
    throw new Error("Invalid timestamp");
  }
  const emotionData: IEmotionData = {
    timestamp: timestamp,
    theta: data.theta,
    delta: data.delta,
    attention: data.attention,
    meditation: data.meditation,
    low_alpha: data.low_alpha,
    high_alpha: data.high_alpha,
    low_beta: data.low_beta,
    high_beta: data.high_beta,
    low_gamma: data.low_gamma,
    mid_gamma: data.mid_gamma,
    poor_signal: data.poor_signal,
    blink_strength: data.blink_strength,
    IBI: data.IBI,
    BPM: data.BPM,
    SDNN_over_RMSSD: data.SDNN_over_RMSSD,
    CVNN: data.CVNN,
    SDNN: data.SDNN,
    RMSSD: data.RMSSD,
    pNN10: data.pNN10,
    pNN20: data.pNN20,
    pNN30: data.pNN30,
    pNN40: data.pNN40,
    pNN50: data.pNN50,
    LF: data.LF,
    HF: data.HF,
    LF_over_HF: data.LF_over_HF,
    stimu_num: data.stimu_num,
    event: data.event,
  };
  return emotionData;
};
