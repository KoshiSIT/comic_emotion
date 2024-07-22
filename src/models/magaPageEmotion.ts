import mongoose, { Model, Schema, Document, Types } from "mongoose";

export interface IMangaPageEmotion extends Document {
  mangaID: Types.ObjectId;
  emotions: number[];
}

const mangaPageEmotionSchema = new Schema({
  mangaPageId: {
    type: Types.ObjectId,
    ref: "MangaPage",
    required: true,
    unique: true,
  },
  emotions: {
    type: [Number],
    required: true,
  },
});

const MangaPageEmotion: Model<IMangaPageEmotion> =
  mongoose.model<IMangaPageEmotion>("MangaPageEmotion", mangaPageEmotionSchema);

export default MangaPageEmotion;
