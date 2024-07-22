import mongoose, { Model, Schema, Document } from "mongoose";

export interface IUserMangaPage extends Document {
  usesrMangaId: string;
  pageNumber: number;
  emotion: number;
}

const userMangaPageSchema = new Schema({
  userMangaId: {
    type: String,
    ref: "UserManga",
    required: true,
  },
  pageNumber: {
    type: Number,
    required: true,
  },
  emotion: {
    type: Number,
    required: false,
  },
});

const UserMangaPage: Model<IUserMangaPage> = mongoose.model<IUserMangaPage>(
  "UserMangaPage",
  userMangaPageSchema
);
export default UserMangaPage;
