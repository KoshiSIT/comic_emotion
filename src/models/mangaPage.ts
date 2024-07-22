import mongoose, { Model, Schema, Document } from "mongoose";

export interface IMangaPage extends Document {
  bookId: string;
  pageNumber: number;
  image: string;
}

const mangaPageSchema = new Schema({
  bookId: {
    type: String,
    ref: "MangaEpisode",
    required: true,
  },
  pageNumber: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});
const MangaPage: Model<IMangaPage> = mongoose.model<IMangaPage>(
  "MangaPage",
  mangaPageSchema
);
export default MangaPage;
