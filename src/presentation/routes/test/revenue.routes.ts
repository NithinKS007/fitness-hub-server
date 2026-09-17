import express from "express";
import { authenticate } from "@presentation/middlewares/auth.middleware";
import { asyncHandler } from "@shared/utils/async-handler";
import {
  getPlatformEarningsController,
} from "@di/container-resolver";
import { authorizeRole } from "@presentation/middlewares/autherisation.middleware";

const router = express.Router();
router.use(authenticate)

router.get("/revenue",authorizeRole(["admin"]),asyncHandler(getPlatformEarningsController.handle.bind(getPlatformEarningsController)));