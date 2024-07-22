import mongoose, { Model, Schema, Document } from "mongoose";

export interface IUserManga extends Document {
  userMangaId: string;
  userName: string;
  bookId: string;
  axquisitionDate: Date;
  generateUserMangaId(): void;
}

const userMangaSchema = new Schema({
  userMangaId: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    ref: "User",
    required: true,
  },
  bookId: {
    type: String,
    ref: "MangaEpisode",
    required: true,
  },
  acquisitionDate: {
    type: Date,
    required: true,
  },
});
userMangaSchema.methods.generateUserMangaId = function () {
  console.log("generateUserMangaId");
  if (!this.userMangaId) {
    this.userMangaId = `${this.userName}-${this.bookId}`;
  }
};
userMangaSchema.pre<IUserManga>("validate", function (next) {
  console.log("validate");
  if (this.isNew) {
    this.generateUserMangaId();
  } else if (this.isModified("userMangaId")) {
    return next(new Error("bookId cannot be manually modified"));
  }
  console.log(this.userMangaId);
  const userMangaIdRegex = new RegExp(`^${this.userName}-${this.bookId}$`);

  if (!userMangaIdRegex.test(this.userMangaId)) {
    return next(new Error("userMangaId must be in the format userName-bookId"));
  }
  next();
});

const UserManga: Model<IUserManga> = mongoose.model<IUserManga>(
  "UserManga",
  userMangaSchema
);

export default UserManga;
