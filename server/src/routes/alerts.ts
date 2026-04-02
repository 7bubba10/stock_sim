import { Router } from "express";
import { getAlerts, createAlert, deleteAlert } from "../controllers/alertsController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get('/', authMiddleware, getAlerts);
router.post('/', authMiddleware, createAlert);
router.delete('/:id', authMiddleware, deleteAlert);

export default router;