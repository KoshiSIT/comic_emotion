import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Manga from "../models/manga";
import MangaEpisode from "../models/mangaEpisode";
import MangaPage from "../models/mangaPage";
import MangaPageEmotion from "../models/magaPageEmotion";
import UserManga from "../models/userManga";
import UserMangaPage from "../models/userMangaPage";
import { IUserMangaPage } from "../models/userMangaPage";
import { getMangaPages } from "./mangaPageController";
import ErrorResponse from "../utils/errorResponse";
// test ok
export const getMangaAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const manga = await Manga.find();
    res.status(200).json({ success: true, data: manga });
  } catch (error: any) {
    next(new ErrorResponse(error.message, 500));
  }
};
// test ok
export const postManga = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const manga = new Manga(req.body);
    await manga.save();
    res.status(201).json({ success: true, data: manga });
  } catch (error: any) {
    next(new ErrorResponse(error.message, 500));
  }
};
// test ok
export const getMangaEpisodeAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const manga = await MangaEpisode.find();
    res.status(200).json({ success: true, data: manga });
  } catch (error: any) {
    next(new ErrorResponse(error.message, 500));
  }
};
// test ok
export const getMangaEpisodeByTitle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("getMangaEpisodeByTitle");
  try {
    console.log(req.params.title);
    const mangaEpisode = await MangaEpisode.find({ title: req.params.title });
    res.status(200).json({ success: true, data: mangaEpisode });
  } catch (error: any) {
    next(new ErrorResponse(error.message, 500));
  }
};
// test ok
export const getOwnedMangaEpisode = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("getOwnedMangaEpisode");
  try {
    console.log(req.user?.name);
    const userManga = await UserManga.find({ userName: req.user?.name });
    res.status(200).json({ success: true, data: userManga });
  } catch (error: any) {
    next(new ErrorResponse(error.message, 500));
  }
};
// test ok
export const getMangaEpisodeContents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userMangaId = req.params.userMangaId;
    const userManga = await UserManga.findOne({ userMangaId: userMangaId });
    if (!userManga) {
      return next(new ErrorResponse("No data found", 404));
    }
    const mangaContent = await getMangaPages(userManga.bookId);
    res.status(200).json({ success: true, data: mangaContent });
  } catch (error: any) {
    next(new ErrorResponse(error.message, 500));
  }
};
// test ok
export const postMangaEpisode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const mangaTitle = req.params.title;
    const mangaEpisodes = req.body;
    Promise.all(
      mangaEpisodes.map(async (mangaEpisode: any) => {
        const manga = await Manga.findOne({ title: mangaTitle });
        if (!manga) {
          throw new Error(`Manga ${mangaTitle} not found`);
        }
        const date = new Date(mangaEpisode.publicationDate);
        const newMangaEpisode = new MangaEpisode({
          title: mangaTitle,
          episodeNumber: mangaEpisode.episodeNumber,
          publicationDate: date,
          pages: mangaEpisode.pages,
          episodeImage: mangaEpisode?.episodeImage,
        });
        try {
          await newMangaEpisode.save();
        } catch (error: any) {
          throw new Error(`Failed to save manga episode: ${error.message}`);
        }
      })
    );
    res
      .status(201)
      .json({ success: true, message: `${mangaTitle} post sucess` });
  } catch (error: any) {
    next(new ErrorResponse(error.message, 500));
  }
};
// test ok
export const postManagaEpisodePages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const MangaPages = req.body;
    // MangaPages = [{ pageNumber: 1, imageUrl: "https://example.com/image.jpg"}, ...]
    const bookId = req.params.bookId;
    await Promise.all(
      MangaPages.map(async (mangaPage: any) => {
        const newMangaPage = new MangaPage({
          bookId: bookId,
          pageNumber: mangaPage.pageNumber,
          image: mangaPage.image,
        });
        await newMangaPage.save();
      })
    );
    res.status(201).json({ success: true, message: `${bookId} post sucess` });
  } catch (error: any) {
    next(new ErrorResponse(error.message, 500));
  }
};

export const UpdateMangaPageEmotion = async (bookId: string, pages: number) => {
  try {
    console.log(
      `Updating manga page emotions for bookId: ${bookId}, pages: ${pages}`
    );
    const userMangas = await UserManga.find({ bookId: bookId });
    console.log(`Found ${userMangas.length} userMangas`);

    const pagesEmotionCount = Array.from({ length: pages }, () => [0, 0, 0, 0]);

    for (const userManga of userMangas) {
      const userMangaPages = await UserMangaPage.find({
        userMangaId: userManga.userMangaId,
      }).sort({ pageNumber: 1 });

      console.log(
        `UserMangaId: ${userManga.userMangaId}, Found ${userMangaPages.length} userMangaPages`
      );

      for (const userMangaPage of userMangaPages) {
        const pageNumber = userMangaPage.pageNumber;
        const emotion = userMangaPage.emotion;
        if (
          pageNumber >= 1 &&
          pageNumber <= pages &&
          emotion >= 0 &&
          emotion < 4
        ) {
          pagesEmotionCount[pageNumber - 1][emotion]++;
        } else {
          console.warn(
            `Invalid pageNumber or emotion for userMangaId: ${userManga.userMangaId}, pageNumber: ${pageNumber}, emotion: ${emotion}`
          );
        }
      }
    }

    console.log(`Pages Emotion Count: ${JSON.stringify(pagesEmotionCount)}`);

    const mangaPages = await MangaPage.find({ bookId: bookId }).sort({
      pageNumber: 1,
    });
    console.log(`Found ${mangaPages.length} mangaPages`);

    await Promise.all(
      mangaPages.map(async (mangaPage, index) => {
        const pageEmotion = await MangaPageEmotion.findOne({
          mangaPageId: mangaPage._id,
        });

        const emotionCount = pagesEmotionCount[index];
        if (!pageEmotion) {
          const newPageEmotion = new MangaPageEmotion({
            mangaPageId: mangaPage._id,
            emotions: emotionCount,
          });
          await newPageEmotion.save();
          console.log(
            `Saved new pageEmotion for mangaPageId: ${mangaPage._id}`
          );
        } else {
          pageEmotion.emotions = emotionCount;
          await pageEmotion.save();
          console.log(`Updated pageEmotion for mangaPageId: ${mangaPage._id}`);
        }
      })
    );
  } catch (error: any) {
    console.error(`Failed to update manga page emotions: ${error.message}`);
    throw new Error(`Failed to update manga page emotions: ${error.message}`);
  }
};

export const UpdateMangaPageEmotionTest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.bookId;
    console.log(bookId);
    const mangaEpisode = await MangaEpisode.findOne({ bookId: bookId });
    if (!mangaEpisode) {
      return next(new ErrorResponse("No data found", 404));
    }
    const pages = mangaEpisode.pages;
    await UpdateMangaPageEmotion(bookId, pages);
    res.status(200).json({ success: true, message: "Update success" });
  } catch (error: any) {
    next(new ErrorResponse(error.message, 500));
  }
};
