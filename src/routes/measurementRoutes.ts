import { Router } from "express";
import { postMeasurement } from "../controllers/measurementController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/measurement/:mangaTitle", protect, postMeasurement);

const measurementRouter = router;
export default measurementRouter;
