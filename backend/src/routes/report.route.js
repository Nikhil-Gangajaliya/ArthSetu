import { Router } from "express";

import {
    getMonthlyReport,
    getYearlyReport,
    getPartyReport,
    exportPartyReportPDF,
    exportPartyReportExcel,
    exportMonthlyReportPDF,
    exportMonthlyReportExcel,
    exportYearlyReportPDF,
    exportYearlyReportExcel
} from "../controllers/report.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/monthly").get(verifyJWT, getMonthlyReport);
router.route("/yearly").get(verifyJWT, getYearlyReport);
router.route("/party/:partyId").get(verifyJWT, getPartyReport);
router.route("/export/party/pdf/:partyId").get(verifyJWT, exportPartyReportPDF);
router.route("/export/party/excel/:partyId").get(verifyJWT, exportPartyReportExcel);
router.route("/export/monthly/pdf").get(verifyJWT, exportMonthlyReportPDF);
router.route("/export/monthly/excel").get(verifyJWT, exportMonthlyReportExcel);
router.route("/export/yearly/pdf").get(verifyJWT, exportYearlyReportPDF);
router.route("/export/yearly/excel").get(verifyJWT, exportYearlyReportExcel);

export default router;