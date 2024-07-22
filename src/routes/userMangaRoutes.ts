import { Router } from "express";
import {
  postUserManga,
  postUserMangaPage,
  getUserMangaEmotion,
} from "../controllers/userMangaController";
import { protect, authorize } from "../middleware/authMiddleware";

const router = Router();

router.post("/userManga/:bookId", protect, postUserManga);
router.post("/userMangaPage/:userMangaId", protect, postUserMangaPage);
router.get("/userManga/myEmotion/:bookId", protect, getUserMangaEmotion);
const userMangaRouter = router;
export default userMangaRouter;
