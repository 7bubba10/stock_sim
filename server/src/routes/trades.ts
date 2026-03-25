import { Router } from "express";
import { executeBuy, executeSell } from "../controllers/tradeController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post('/buy', authMiddleware, executeBuy);
router.post('/sell', authMiddleware, executeSell);

export default router;