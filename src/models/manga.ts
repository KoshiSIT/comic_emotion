import mongoose, { Model, Schema, Document } from "mongoose";

export interface IManga extends Document {
  title: string;
  author: string;
  publisher: string;
  genre: string[];
}

const mangaSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  genre: {
    type: [String],
    required: true,
  },
});

const Manga: Model<IManga> = mongoose.model<IManga>("Manga", mangaSchema);
export default Manga;
