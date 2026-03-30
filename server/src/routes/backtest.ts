import { Router } from "express";
import { runBackTest } from "../controllers/backtestController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post('/', authMiddleware, runBackTest);

export default router;