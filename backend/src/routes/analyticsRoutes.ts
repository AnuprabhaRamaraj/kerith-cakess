import { Router } from "express";
import { getRealtimeAnalytics } from "../controllers/analyticsController";

const router = Router();

router.get("/realtime", getRealtimeAnalytics);

export default router;
