import express from "express";
import { asyncHandler } from "@shared/utils/async-handler";
import { authenticate } from "@presentation/middlewares/auth.middleware";
import { authorizeRole } from "@presentation/middlewares/autherisation.middleware";
import { zegoCloudTokenController } from "@di/container-resolver";

const zegocloudRoutes = express.Router();
zegocloudRoutes.use(authenticate)
zegocloudRoutes.use(authorizeRole(["user","trainer"]))

// TOKEN CREATION ROUTES
zegocloudRoutes.get("/token",asyncHandler(zegoCloudTokenController.handle.bind(zegoCloudTokenController)));
export default zegocloudRoutes