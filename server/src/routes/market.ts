import { Router } from "express";
import { getPrice } from "../controllers/marketController";

const router = Router();

router.get('/price', getPrice);

export default router;