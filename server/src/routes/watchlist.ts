import { Router } from "express";
import { getWatchlist, addToWatchlist, removeFromWatchlist } from "../controllers/watchlistController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get('/', authMiddleware, getWatchlist);
router.post('/', authMiddleware, addToWatchlist);
router.delete('/:ticker', authMiddleware, removeFromWatchlist);

export default router;