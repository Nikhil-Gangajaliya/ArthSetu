import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Entry } from "../models/entry.model.js";
import { Party } from "../models/party.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

// createParty
// getParties
// updateParty
// hideParty
// unhideParty
// getHiddenParties
// searchParties

//create party and refere foelds from party model

const createParty = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;

    if (!name) {
        throw new ApiError(400, "Name is required");
    }

    const party = new Party({
        name,
        email,
        phone
    });

    await party.save();

    res.status(201).json(new ApiResponse(true, "Party created successfully", party));
});

const getParties = asyncHandler(async (req, res) => {

    const parties = await Party.find({ isHidden: false })
        .sort({ nameInitial: 1, name: 1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            parties,
            "Parties fetched successfully"
        )
    );

});

const updateParty = asyncHandler(async (req, res) => {
    const { partyId } = req.params;
    const { name, email, phone } = req.body;

    const updateData = {};

    if (name) {
        updateData.name = name;
        updateData.nameInitial = name.charAt(0).toUpperCase();
    }

    if (email) {
        updateData.email = email;
    }

    if (phone) {
        updateData.phone = phone;
    }

    if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, "No fields provided for update");
    }

    const party = await Party.findByIdAndUpdate(
        partyId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!party) {
        throw new ApiError(404, "Party not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            party,
            "Party updated successfully"
        )
    );
});

const hideParty = asyncHandler(async (req, res) => {
    const { partyId } = req.params;

    const party = await Party.findByIdAndUpdate(
        partyId,
        { $set: { isHidden: true } },
        { new: true }
    );

    if (!party) {
        throw new ApiError(404, "Party not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            party,
            "Party hidden successfully"
        )
    );
});

const unhideParty = asyncHandler(async (req, res) => {
    const { partyId } = req.params;

    const party = await Party.findByIdAndUpdate(
        partyId,
        { $set: { isHidden: false } },
        { new: true }
    );

    if (!party) {
        throw new ApiError(404, "Party not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            party,
            "Party unhidden successfully"
        )
    );
});

const getHiddenParties = asyncHandler(async (req, res) => {

    const parties = await Party.find({ isHidden: true })
        .sort({ nameInitial: 1, name: 1 })

    return res.status(200).json(
        new ApiResponse(
            200,
            parties,
            "Hidden parties fetched successfully"
        )
    );
});

const searchParties = asyncHandler(async (req, res) => {

    const query = req.query.query || "";

    const parties = await Party.find({
        name: { $regex: query, $options: "i" },
        isHidden: false
    }).sort({ nameInitial: 1, name: 1 })

    return res.status(200).json(
        new ApiResponse(
            200,
            parties,
            "Search results"
        )
    );
});

const getPartyBalance = asyncHandler(async (req, res) => {

    const { partyId } = req.params;

    const party = await Party.findById(partyId);

    if (!party) {
        throw new ApiError(404, "Party not found");
    }

    let status;
    let amount;

    if (party.balance > 0) {
        status = "To Collect";
        amount = party.balance;
    } else if (party.balance < 0) {
        status = "To Pay";
        amount = Math.abs(party.balance);
    } else {
        status = "Settled";
        amount = 0;
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                creditTotal: party.totalCredit,
                debitTotal: party.totalDebit,
                balance: party.balance,
                status,
                amount
            },
            "Party balance fetched successfully"
        )
    );
});

export {
    createParty,
    getParties,
    updateParty,
    hideParty,
    unhideParty,
    getHiddenParties,
    searchParties,
    getPartyBalance
};
