import mongoose, { Model, Schema } from "mongoose";

export interface IManga {
  title: string;
  author: string;
  publisher: string;
  genre: string[];
  volume: number;
  publicationDate: Date;
  summary: string;
  pages: number;
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
  volume: {
    type: Number,
    required: true,
  },
  publicationDate: {
    type: Date,
    required: true,
  },
  summary: {
    type: String,
    required: false,
  },
  pages: {
    type: Number,
    required: true,
  },
});

const Manga: Model<IManga> = mongoose.model<IManga>("Manga", mangaSchema);
export default Manga;
