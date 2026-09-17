
import express from "express";
import { authenticate } from "@presentation/middlewares/auth.middleware";
import { asyncHandler } from "@shared/utils/async-handler";
import {
  createPlaylistController,
  editPlaylistController,
  getPlaylistController,
  updatePlaylistPrivacyController,
} from "@di/container-resolver";
import { validate } from "@presentation/middlewares/validation.middleware";
import { playlistSchema } from "@presentation/middlewares/validation-schemas/playlist-schema";
import { authorizeRole } from "@presentation/middlewares/autherisation.middleware";

const router = express.Router();
router.use(authenticate)

//USER ROUTES
router.get("/trainers/:id/playlists",authorizeRole(["user"]),asyncHandler(getPlaylistController.handle.bind(getPlaylistController)));

//TRAINER ROUTES
router.post("/playlists",playlistSchema,validate,authorizeRole(["trainer"]),asyncHandler(createPlaylistController.handle.bind(createPlaylistController)));
router.get("/playlists",authorizeRole(["trainer"]),asyncHandler(getPlaylistController.handle.bind(getPlaylistController)));// pass get all true or false as query params
router.patch("/playlists/:id",authorizeRole(["trainer"]),asyncHandler(updatePlaylistPrivacyController.handle.bind(updatePlaylistPrivacyController)));
router.put("/playlists/:id",authorizeRole(["trainer"]),playlistSchema,validate,asyncHandler(editPlaylistController.handle.bind(editPlaylistController)));

export default router