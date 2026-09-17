import express from "express";
import { asyncHandler } from "@shared/utils/async-handler";
import { authenticate } from "@presentation/middlewares/auth.middleware";
import { authorizeRole } from "@presentation/middlewares/autherisation.middleware";
import { zegoCloudTokenController } from "@di/container-resolver";

const router = express.Router();
router.use(authenticate)
router.use(authorizeRole(["user","trainer"]))

// TOKEN CREATION ROUTES
router.get("/zegocloud/token",asyncHandler(zegoCloudTokenController.handle.bind(zegoCloudTokenController)));
export default router