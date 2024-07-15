import mongoose, { Model, Schema } from "mongoose";

export interface IEmotionData {
  measurementId: string;
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

const emotionDataSchema = new Schema({
  measurementId: {
    type: String,
    ref: "Measurement",
    required: true,
  },
  timestamp: { type: Date, required: true, unique: true },
  theta: { type: Number, required: true },
  delta: { type: Number, required: true },
  attention: { type: Number, required: true },
  meditation: { type: Number, required: true },
  low_alpha: { type: Number, required: true },
  high_alpha: { type: Number, required: true },
  low_beta: { type: Number, required: true },
  high_beta: { type: Number, required: true },
  low_gamma: { type: Number, required: true },
  mid_gamma: { type: Number, required: true },
  poor_signal: { type: Number, required: true },
  blink_strength: { type: Number, required: true },
  IBI: { type: Number, required: true },
  BPM: { type: Number, required: true },
  SDNN_over_RMSSD: { type: Number, required: true },
  CVNN: { type: Number, required: true },
  SDNN: { type: Number, required: true },
  RMSSD: { type: Number, required: true },
  pNN10: { type: Number, required: true },
  pNN20: { type: Number, required: true },
  pNN30: { type: Number, required: true },
  pNN40: { type: Number, required: true },
  pNN50: { type: Number, required: true },
  LF: { type: Number, required: true },
  HF: { type: Number, required: true },
  LF_over_HF: { type: Number, required: true },
  stimu_num: { type: Number, required: true },
  event: { type: String },
});

const EmotionData: Model<IEmotionData> = mongoose.model<IEmotionData>(
  "EmotionData",
  emotionDataSchema
);

export default EmotionData;
