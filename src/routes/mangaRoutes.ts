import { Router } from "express";
import {
  getMangaAll,
  getMangaEpisodeAll,
  getMangaEpisodeByTitle,
  getOwnedMangaEpisode,
  getMangaEpisodeContents,
  postMangaEpisode,
  postManagaEpisodePages,
  postManga,
  UpdateMangaPageEmotionTest,
} from "../controllers/mangaController";
import { protect, authorize } from "../middleware/authMiddleware";

const router = Router();
router.get("/manga", getMangaAll);
router.post("/mangaPostTest", postManga);
router.get("/mangaEpisode", getMangaEpisodeAll);
router.get("/mangaEpisode/owned", protect, getOwnedMangaEpisode);
router.get("/mangaEpisode/:title", protect, getMangaEpisodeByTitle);

router.get(
  "/mangaEpisode/contents/:userMangaId",
  protect,
  getMangaEpisodeContents
);
router.post("/mangaEpisode/:title", postMangaEpisode);
router.post("/mangaEpisodePages/:bookId", postManagaEpisodePages);
router.put(
  "/mangaEpisode/updateEmotion/:bookId",
  protect,
  UpdateMangaPageEmotionTest
);

const mangaRouter = router;
export default mangaRouter;
