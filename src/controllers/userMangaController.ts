import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Manga from "../models/manga";
import UserManga from "../models/userManga";
import { IUserManga } from "../models/userManga";
import UserMangaPage from "../models/userMangaPage";
import ErrorResponse from "../utils/errorResponse";
// test ok
export const postUserManga = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.bookId;
    const userManga = new UserManga({
      userName: req.user?.name,
      bookId: bookId,
      acquisitionDate: new Date(),
    });
    await userManga.save();
    res.status(201).json({ success: true, data: userManga });
  } catch (error: any) {
    next(new ErrorResponse(error.message, 500));
  }
};
// test ok
export const postUserMangaPage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userMangaPages = req.body;
    const userMangaId = req.params.userMangaId;
    console.log(userMangaId);
    const userManga = await UserManga.findOne({ userMangaId });
    if (!userManga) {
      return next(new ErrorResponse("Invalid userMangaId", 404));
    }
    Promise.all(
      userMangaPages.map(async (userMangaPage: any) => {
        const mangaPage = new UserMangaPage({
          userMangaId: userMangaId,
          pageNumber: userMangaPage.pageNumber,
          emotion: userMangaPage.emotion,
        });
        await mangaPage.save();
      })
    );
    res.status(201).json({ success: true, data: userMangaPages });
  } catch (error: any) {
    next(new ErrorResponse(error.message, 500));
  }
};
export const getUserMangaEmotion = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.bookId;
    const userName = req.user?.name;
    console.log(bookId);
    console.log(userName);
    const userManga = await UserManga.findOne({ userName, bookId });
    if (!userManga) {
      return next(new ErrorResponse("No data found", 404));
    }
    const userMangaPages = await UserMangaPage.find({
      userMangaId: userManga.userMangaId,
    }).sort({ pageNumber: 1 });
    res.status(200).json({ success: true, data: userMangaPages });
  } catch (error: any) {
    next(new ErrorResponse(error.message, 500));
  }
};
