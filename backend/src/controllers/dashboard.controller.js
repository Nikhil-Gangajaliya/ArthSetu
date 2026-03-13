import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Entry } from "../models/entry.model.js";
import { Party } from "../models/party.model.js";


// ---------------- SUMMARY CARDS ----------------

const getDashboardStats = asyncHandler(async (req, res) => {

    const totalParties = await Party.countDocuments({ isHidden: false });

    const creditData = await Entry.aggregate([
        { $match: { type: "credit" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const debitData = await Entry.aggregate([
        { $match: { type: "debit" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalCredit = creditData[0]?.total || 0;
    const totalDebit = debitData[0]?.total || 0;

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalParties,
                totalCredit,
                totalDebit
            },
            "Dashboard stats fetched"
        )
    );

});


// ---------------- RECENT ENTRIES ----------------

const getRecentEntries = asyncHandler(async (req, res) => {

    const entries = await Entry.find()
        .populate("party", "name")
        .sort({ date: -1 })
        .limit(5);

    return res.status(200).json(
        new ApiResponse(
            200,
            entries,
            "Recent entries fetched"
        )
    );

});


// ---------------- WEEKLY CHART ----------------

const getWeeklyChart = asyncHandler(async (req, res) => {

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const data = await Entry.aggregate([
        {
            $match: {
                date: { $gte: last7Days }
            }
        },
        {
            $group: {
                _id: {
                    day: {
                        $dayOfWeek: {
                            date: "$date",
                            timezone: "Asia/Kolkata"
                        }
                    },
                    type: "$type"
                },
                total: { $sum: "$amount" }
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, data, "Weekly chart data")
    );

});


// ---------------- MONTHLY CHART ----------------

const getMonthlyChart = asyncHandler(async (req, res) => {

    const start = new Date(new Date().getFullYear(), 0, 1);

    const data = await Entry.aggregate([
        { $match: { date: { $gte: start } } },
        {
            $group: {
                _id: {
                    $month: {
                        date: "$date",
                        timezone: "Asia/Kolkata"
                    }
                },
                total: { $sum: "$amount" }
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, data, "Monthly chart data")
    );

});


// ---------------- TOP CREDIT ----------------

const getTopCredit = asyncHandler(async (req, res) => {

    const data = await Entry.aggregate([
        { $match: { type: "credit" } },
        {
            $group: {
                _id: "$party",
                total: { $sum: "$amount" }
            }
        },
        { $sort: { total: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "parties",
                localField: "_id",
                foreignField: "_id",
                as: "party"
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, data, "Top credit parties")
    );

});


// ---------------- TOP DEBIT ----------------

const getTopDebit = asyncHandler(async (req, res) => {

    const data = await Entry.aggregate([
        { $match: { type: "debit" } },
        {
            $group: {
                _id: "$party",
                total: { $sum: "$amount" }
            }
        },
        { $sort: { total: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "parties",
                localField: "_id",
                foreignField: "_id",
                as: "party"
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, data, "Top debit parties")
    );

});


export {
    getDashboardStats,
    getRecentEntries,
    getWeeklyChart,
    getMonthlyChart,
    getTopCredit,
    getTopDebit
};