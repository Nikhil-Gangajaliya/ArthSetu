import { Router } from "express";
import { 
    loginUser,
    logoutUser,
    refreshAccessToken,
    getProfile,
    updateProfile
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/profile").get(verifyJWT, getProfile);
router.route("/profile").put(verifyJWT, updateProfile);

export default router;