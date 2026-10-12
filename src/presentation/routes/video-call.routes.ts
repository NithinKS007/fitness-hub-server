import { authorizeRole } from "@presentation/middlewares/autherisation.middleware";
import { authenticate } from "@presentation/middlewares/auth.middleware";
import { asyncHandler } from "@shared/utils/async-handler";
import {
  getVideoCallLogController,
} from "@di/container-resolver";
import express from "express";

const router = express.Router();
router.use(authenticate)

router.get("/video-call-logs",authorizeRole(["user","trainer"]),asyncHandler(getVideoCallLogController.handle.bind(getVideoCallLogController)));

export default router