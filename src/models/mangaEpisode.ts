import mongoose, { Model, Schema, Document } from "mongoose";

export interface IMangaEpisode extends Document {
  title: string;
  bookId: string;
  episodeNumber: number;
  publicationDate: Date;
  summary: string;
  pages: number;
  episodeImage: string;
  generateBookId(): void;
}

const mangaEpisodeSchema = new Schema({
  title: {
    type: String,
    ref: "Manga",
    required: true,
  },
  bookId: {
    type: String,
    required: true,
    unique: true,
  },
  genre: {
    type: [String],
    required: true,
  },
  episodeNumber: {
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
  episodeImage: {
    type: String,
    required: false,
  },
});
mangaEpisodeSchema.methods.generateBookId = function () {
  this.bookId = `${this.title}-${this.episodeNumber}`;
  console.log(this.bookId);
};
mangaEpisodeSchema.pre<IMangaEpisode>("validate", function (next) {
  if (this.isNew) {
    this.generateBookId();
  } else if (this.isModified("bookId")) {
    return next(new Error("bookId cannot be manually modified"));
  }
  console.log(this.bookId);
  const bookIdRegex = new RegExp(`^${this.title}-${this.episodeNumber}$`);

  if (!bookIdRegex.test(this.bookId)) {
    return next(new Error("bookId must be in the format title-episodeNumber"));
  }
  next();
});
const Manga: Model<IMangaEpisode> = mongoose.model<IMangaEpisode>(
  "MangaEpisode",
  mangaEpisodeSchema
);
export default Manga;
