import mongose, { Model, Schema } from "mongoose";

export interface IMeasurement {
  userName: string;
  measurementId: string;
  mangaTitle: string;
  emotionType: string;
}

const measurementSchema = new Schema({
  userName: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  measurementId: {
    type: String,
    required: true,
    unique: true,
  },
  mangaTitle: {
    type: String,
    ref: "Manga",
    required: true,
  },
  emotionType: {
    type: String,
    required: true,
  },
});

measurementSchema.methods.generateMeasurementId = function () {
  if (!this.measurementId) {
    this.measurementId = `${this.userName}-${new Date().toISOString()}`;
  }
};
const Measurement: Model<IMeasurement> = mongose.model<IMeasurement>(
  "Measurement",
  measurementSchema
);

export default Measurement;
