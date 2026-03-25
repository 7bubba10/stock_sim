import { Router } from "express";
import { executeBuy } from "../controllers/tradeController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post('/buy', authMiddleware, executeBuy);

export default router;