import mongose, { Model, Schema, Document } from "mongoose";

export interface IMeasurement extends Document {
  userName: string;
  measurementId: string;
  bookId: string;
  emotionType: string;
  isCal: boolean;
  generateMeasurementId(): void;
}

const measurementSchema = new Schema({
  userName: {
    type: String,
    ref: "User",
    required: true,
  },
  measurementId: {
    type: String,
    required: true,
    unique: true,
  },
  bookId: {
    type: String,
    ref: "MangaEpisode",
    required: true,
  },
  isCal: {
    type: Boolean,
    required: true,
  },
});

measurementSchema.methods.generateMeasurementId = function () {
  if (!this.measurementId) {
    this.measurementId = `${this.userName}-${new Date().toISOString()}`;
  }
};
measurementSchema.pre<IMeasurement>("validate", function (next) {
  const measurementIdRegex = new RegExp(
    `^${this.userName}-\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$`
  );

  if (!measurementIdRegex.test(this.measurementId)) {
    return next(
      new Error(
        "measurementId must be in the format userName-YYYY-MM-DDTHH:MM:SS.sssZ"
      )
    );
  }

  if (this.isNew) {
    this.generateMeasurementId();
  } else if (this.isModified("measurementId")) {
    return next(new Error("measurementId cannot be manually modified"));
  }
  next();
});
const Measurement: Model<IMeasurement> = mongose.model<IMeasurement>(
  "Measurement",
  measurementSchema
);

export default Measurement;
