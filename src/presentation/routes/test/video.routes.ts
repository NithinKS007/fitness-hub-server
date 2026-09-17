import { authenticate } from "@presentation/middlewares/auth.middleware";
import { asyncHandler } from "@shared/utils/async-handler";
import {
  addVideoController,
  editVideoController,
  getAllVideosController,
  updateVideoStatusController,
  getPublicVideoDetailsController,
  getPublicVideosController,
} from "@di/container-resolver";
import { validate } from "@presentation/middlewares/validation.middleware";
import { videoSchema } from "@presentation/middlewares/validation-schemas/video-schema";
import { authorizeRole } from "@presentation/middlewares/autherisation.middleware";
import express from "express"

const router = express.Router();
router.use(authenticate)

//USER VIDEO ROUTES
router.get("/trainers/:id/videos",authorizeRole(["user"]),asyncHandler(getPublicVideosController.handle.bind(getPublicVideosController)));
router.get("/trainers/:trainerId/videos/:videoId",authorizeRole(["user"]),asyncHandler(getPublicVideoDetailsController.handle.bind(getPublicVideoDetailsController)));

//TRAINER VIDEO ROUTES
router.post("/videos",videoSchema,validate,authorizeRole(["trainer"]),asyncHandler(addVideoController.handle.bind(addVideoController)));
router.get("/videos",authorizeRole(["trainer"]),asyncHandler(getAllVideosController.handle.bind(getAllVideosController)));
router.patch("/videos/:id",authorizeRole(["trainer"]),asyncHandler(updateVideoStatusController.handle.bind(updateVideoStatusController)));
router.put("/videos/:id",authorizeRole(["trainer"]),videoSchema,validate,asyncHandler(editVideoController.handle.bind(editVideoController)));

export default router