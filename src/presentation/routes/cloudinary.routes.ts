import express from "express";
import { asyncHandler } from "@shared/utils/async-handler";
import { cloudinaryController } from "@di/container-resolver";
import { authenticate } from "@presentation/middlewares/auth.middleware";
import { authorizeRole } from "@presentation/middlewares/autherisation.middleware";

const router = express.Router();
router.use(authenticate)
router.use(authorizeRole(["user","trainer"]))

router.get("/cloudinary/signature",asyncHandler(cloudinaryController.handle.bind(cloudinaryController)));

export default router