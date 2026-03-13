import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Entry } from "../models/entry.model.js";
import { generatePDF, generateExcel } from "../utils/report.util.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";


// ---------------- MONTHLY REPORT ----------------

const getMonthlyReport = asyncHandler(async (req, res) => {

    const { year, month } = req.query;

    if (!year || !month) {
        throw new ApiError(400, "Year and month are required");
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const entries = await Entry.find({
        date: { $gte: start, $lt: end }
    }).populate("party", "name");

    let credit = 0;
    let debit = 0;

    entries.forEach(e => {
        if (e.type === "credit") credit += e.amount;
        else debit += e.amount;
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                year,
                month,
                entries,
                totalCredit: credit,
                totalDebit: debit,
                balance: credit - debit
            },
            "Monthly report fetched"
        )
    );
});


// ---------------- YEARLY REPORT ----------------

const getYearlyReport = asyncHandler(async (req, res) => {

    const { year } = req.query;

    if (!year) {
        throw new ApiError(400, "Year is required");
    }

    const start = new Date(year, 0, 1);
    const end = new Date(Number(year) + 1, 0, 1);

    const entries = await Entry.find({
        date: { $gte: start, $lt: end }
    }).populate("party", "name");

    let credit = 0;
    let debit = 0;

    entries.forEach(e => {
        if (e.type === "credit") credit += e.amount;
        else debit += e.amount;
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                year,
                entries,
                totalCredit: credit,
                totalDebit: debit,
                balance: credit - debit
            },
            "Yearly report fetched"
        )
    );
});


// ---------------- PARTY REPORT ----------------

const getPartyReport = asyncHandler(async (req, res) => {

    const { partyId } = req.params;

    const entries = await Entry.find({ party: partyId })
        .populate("party", "name")
        .sort({ date: -1 });

    let credit = 0;
    let debit = 0;

    entries.forEach(e => {
        if (e.type === "credit") credit += e.amount;
        else debit += e.amount;
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                entries,
                totalCredit: credit,
                totalDebit: debit,
                balance: credit - debit
            },
            "Party report fetched"
        )
    );
});

const exportPartyReportPDF = asyncHandler(async (req, res) => {

    const { partyId } = req.params;

    const entries = await Entry.find({ party: partyId })
        .populate("party", "name")
        .sort({ date: -1 });

    generatePDF(res, entries, "party-report");
});


const exportPartyReportExcel = asyncHandler(async (req, res) => {

    const { partyId } = req.params;

    const entries = await Entry.find({ party: partyId })
        .populate("party", "name")
        .sort({ date: -1 });

    await generateExcel(res, entries, "party-report");

});

const exportMonthlyReportPDF = asyncHandler(async (req, res) => {

    const { year, month } = req.query;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const entries = await Entry.find({
        date: { $gte: start, $lt: end }
    }).populate("party", "name");

    generatePDF(res, entries, "monthly-report");
});


const exportMonthlyReportExcel = asyncHandler(async (req, res) => {

    const { year, month } = req.query;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const entries = await Entry.find({
        date: { $gte: start, $lt: end }
    }).populate("party", "name");

    await generateExcel(res, entries, "monthly-report");

});

const exportYearlyReportPDF = asyncHandler(async (req, res) => {

    const { year } = req.query;

    const start = new Date(year, 0, 1);
    const end = new Date(Number(year) + 1, 0, 1);

    const entries = await Entry.find({
        date: { $gte: start, $lt: end }
    }).populate("party", "name");

    generatePDF(res, entries, "yearly-report");

});


const exportYearlyReportExcel = asyncHandler(async (req, res) => {

    const { year } = req.query;

    const start = new Date(year, 0, 1);
    const end = new Date(Number(year) + 1, 0, 1);

    const entries = await Entry.find({
        date: { $gte: start, $lt: end }
    }).populate("party", "name");

    await generateExcel(res, entries, "yearly-report");

});

export {
    getMonthlyReport,
    getYearlyReport,
    getPartyReport,
    exportPartyReportPDF,
    exportPartyReportExcel,
    exportMonthlyReportPDF,
    exportMonthlyReportExcel,
    exportYearlyReportPDF,
    exportYearlyReportExcel 
};