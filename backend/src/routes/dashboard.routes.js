import { Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getDashboardStats,
    getRecentEntries,
    getWeeklyChart,
    getMonthlyChart,
    getTopCredit,
    getTopDebit
} from "../controllers/dashboard.controller.js";

const router = Router();

router.route("/stats").get(verifyJWT, getDashboardStats);
router.route("/recent-entries").get(verifyJWT, getRecentEntries);
router.route("/weekly-chart").get(verifyJWT, getWeeklyChart);
router.route("/monthly-chart").get(verifyJWT, getMonthlyChart);
router.route("/top-credit").get(verifyJWT, getTopCredit);
router.route("/top-debit").get(verifyJWT, getTopDebit);

export default router;