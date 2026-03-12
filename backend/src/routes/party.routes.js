import { Router } from "express";
import {
    createParty,
    getParties,
    updateParty,
    hideParty,
    unhideParty,
    getHiddenParties,
    searchParties,
    getPartyBalance
} from "../controllers/party.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-party").post(verifyJWT, createParty);
router.route("/parties").get(verifyJWT, getParties);
router.route("/update-party/:partyId").patch(verifyJWT, updateParty);
router.route("/hide-party/:partyId").put(verifyJWT, hideParty);
router.route("/unhide-party/:partyId").put(verifyJWT, unhideParty);
router.route("/hidden-parties").get(verifyJWT, getHiddenParties);
router.route("/search-parties").get(verifyJWT, searchParties);
router.route("/party-balance/:partyId").get(verifyJWT, getPartyBalance);

export default router;