import { Router } from "express";
import {
    createEntry,
    updateEntry,
    deleteEntry,
    getEntries,
    getRecentEntries
} from "../controllers/entry.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-entry/:partyId").post(verifyJWT, createEntry);
router.route("/update-entry/:entryId").patch(verifyJWT, updateEntry);
router.route("/delete-entry/:entryId").delete(verifyJWT, deleteEntry);
router.route("/entries/:partyId").get(verifyJWT, getEntries);
router.route("/recent-entries").get(verifyJWT, getRecentEntries);

export default router;