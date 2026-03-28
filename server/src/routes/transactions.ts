import { Router } from "express";
import { getTransaction } from "../controllers/transactionController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get('/', authMiddleware, getTransaction);

export default router;