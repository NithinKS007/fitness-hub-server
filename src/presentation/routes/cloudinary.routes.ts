import express from "express";
import { asyncHandler } from "@shared/utils/async-handler";
import { cloudinaryController } from "@di/container-resolver";
import { authenticate } from "@presentation/middlewares/auth.middleware";
import { authorizeRole } from "@presentation/middlewares/autherisation.middleware";

const cloudinaryRoutes = express.Router();
cloudinaryRoutes.use(authenticate)
cloudinaryRoutes.use(authorizeRole(["user","trainer"]))

cloudinaryRoutes.get("/signature",asyncHandler(cloudinaryController.handle.bind(cloudinaryController)));

export default cloudinaryRoutes