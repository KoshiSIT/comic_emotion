import MangaPage from "../models/mangaPage";
import MangaPageEmotion from "../models/magaPageEmotion";

export const getMangaPages = async (bookId: string) => {
  const mangaPages = await MangaPage.find({
    bookId: bookId,
  }).sort({ pageNumber: 1 });
  if (!mangaPages.length) {
    return null;
  }

  const mangaPageEmotions = await Promise.all(
    mangaPages.map(async (page) => {
      const emotions = await MangaPageEmotion.findOne({
        mangaPageId: page._id,
      });
      return { ...page.toObject(), emotions };
    })
  );
  console.log(mangaPageEmotions);

  return mangaPageEmotions;
};
