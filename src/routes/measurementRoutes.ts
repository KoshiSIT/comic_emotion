import { Router } from "express";
import {
  postMeasurement,
  getMeasurementAll,
  getMeasurementByUser,
  getMeasurementLatestByUser,
} from "../controllers/measurementController";
import { protect } from "../middleware/authMiddleware";

const router = Router();
router.get("/measurement", getMeasurementAll);
router.get("/measurement/user", protect, getMeasurementByUser);
router.get("/measurement/userLatest", protect, getMeasurementLatestByUser);
router.post("/measurement/:bookId", protect, postMeasurement);

const measurementRouter = router;
export default measurementRouter;
