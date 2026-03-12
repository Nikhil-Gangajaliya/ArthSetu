import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Entry } from "../models/entry.model.js";
import { Party } from "../models/party.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createEntry = asyncHandler(async (req, res) => {

    const { partyId } = req.params;
    const { type, amount, reference, note, date } = req.body;

    if (!type || !amount) {
        throw new ApiError(400, "Type and amount are required");
    }

    const entry = await Entry.create({
        party: partyId,
        type,
        amount,
        reference,
        note,
        date
    });

    const party = await Party.findById(partyId);

    if (type === "credit") {
        party.totalCredit += amount;
    } else {
        party.totalDebit += amount;
    }

    party.balance = party.totalCredit - party.totalDebit;

    await party.save();

    return res.status(201).json(
        new ApiResponse(
            201,
            entry,
            "Entry created successfully"
        )
    );
});

const updateEntry = asyncHandler(async (req, res) => {

    const { entryId } = req.params;
    const { type, amount, reference, note, date } = req.body;

    const entry = await Entry.findById(entryId);

    if (!entry) {
        throw new ApiError(404, "Entry not found");
    }

    const party = await Party.findById(entry.party);

    // Remove old effect
    if (entry.type === "credit") {
        party.totalCredit -= entry.amount;
    } else {
        party.totalDebit -= entry.amount;
    }

    // Update entry fields
    if (type) entry.type = type;
    if (amount) entry.amount = amount;
    if (reference) entry.reference = reference;
    if (note) entry.note = note;
    if (date) entry.date = date;

    // Apply new effect
    if (entry.type === "credit") {
        party.totalCredit += entry.amount;
    } else {
        party.totalDebit += entry.amount;
    }

    party.balance = party.totalCredit - party.totalDebit;

    await party.save();
    await entry.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            entry,
            "Entry updated successfully"
        )
    );
});

const deleteEntry = asyncHandler(async (req, res) => {

    const { entryId } = req.params;

    const entry = await Entry.findById(entryId);

    if (!entry) {
        throw new ApiError(404, "Entry not found");
    }

    const party = await Party.findById(entry.party);

    if (entry.type === "credit") {
        party.totalCredit -= entry.amount;
    } else {
        party.totalDebit -= entry.amount;
    }

    party.balance = party.totalCredit - party.totalDebit;

    await party.save();
    await entry.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            entry,
            "Entry deleted successfully"
        )
    );
});

const getEntries = asyncHandler(async (req, res) => {

    const { partyId } = req.params;

    const entries = await Entry.find({ party: partyId })
        .sort({ date: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            entries,
            "Entries fetched successfully"
        )
    );
});

const getRecentEntries = asyncHandler(async (req, res) => {

    const entries = await Entry.find()
        .populate("party", "name")
        .sort({ date: -1 })
        .limit(5);

    return res.status(200).json(
        new ApiResponse(
            200,
            entries,
            "Recent entries fetched successfully"
        )
    );
});

export {
    createEntry,
    updateEntry,
    deleteEntry,
    getEntries,
    getRecentEntries
};