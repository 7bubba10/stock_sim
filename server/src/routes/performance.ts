import { Router } from "express";
import { getPerformance } from "../controllers/performanceController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get('/', authMiddleware, getPerformance);

export default router;