import express from "express";
import { authenticate } from "@presentation/middlewares/auth.middleware";
import { asyncHandler } from "@shared/utils/async-handler";
import {
  addVideoController,
  blockSubPlanController,
  cancelAppointmentController,
  createBookingSlotController,
  createPlaylistController,
  createSubPlanController,
  deleteBookingSlotController,
  deleteSubPlanController,
  editPlaylistController,
  editSubPlanController,
  editVideoController,
  getAllPlaylistController,
  getAllVideosController,
  getBookingRequestsController,
  getPendingSlotsController,
  getPlaylistController,
  getTrainerSchedulesController,
  getTrainerSubscribersController,
  getTrainerSubscriptionController,
  getTrainerVideoCallLogController,
  trainerDashboardController,
  updateAppointmentController,
  updatePlaylistPrivacyController,
  updateTrainerProfileController,
  updateVideoStatusController,
} from "@di/container-resolver";
import { validate } from "@presentation/middlewares/validation.middleware";
import { subscriptionSchema } from "@presentation/middlewares/validation-schemas/subscription-schema";
import { playlistSchema } from "@presentation/middlewares/validation-schemas/playlist-schema";
import { slotSchema } from "@presentation/middlewares/validation-schemas/slot-schema";
import { videoSchema } from "@presentation/middlewares/validation-schemas/video-schema";
import { authorizeRole } from "@presentation/middlewares/autherisation.middleware";

const trainerRoutes = express.Router();
trainerRoutes.use(authenticate)
trainerRoutes.use(authorizeRole(["trainer"]))

// SUBSCRIPTION ROUTES
trainerRoutes.post("/subscriptions",subscriptionSchema,validate,asyncHandler(createSubPlanController.handle.bind(createSubPlanController)));
trainerRoutes.get("/subscriptions",asyncHandler(getTrainerSubscriptionController.handle.bind(getTrainerSubscriptionController)));
trainerRoutes.patch("/subscriptions/:subscriptionId",asyncHandler(blockSubPlanController.handle.bind(blockSubPlanController)));
trainerRoutes.put("/subscriptions/:subscriptionId",asyncHandler(editSubPlanController.handle.bind(editSubPlanController)));
trainerRoutes.delete("/subscriptions/:subscriptionId",asyncHandler(deleteSubPlanController.handle.bind(deleteSubPlanController)));
trainerRoutes.get("/subscribers",asyncHandler(getTrainerSubscribersController.handle.bind(getTrainerSubscribersController)));

//PLAYLIST MANAGEMENT ROUTES
trainerRoutes.post("/playlists",playlistSchema,validate,asyncHandler(createPlaylistController.handle.bind(createPlaylistController)));
trainerRoutes.get("/playlists",asyncHandler(getPlaylistController.handle.bind(getPlaylistController)));
trainerRoutes.get("/playlists/all",asyncHandler(getAllPlaylistController.handle.bind(getAllPlaylistController)));
trainerRoutes.patch("/playlists/:playListId",asyncHandler(updatePlaylistPrivacyController.handle.bind(updatePlaylistPrivacyController)));
trainerRoutes.put("/playlists/:playListId",asyncHandler(editPlaylistController.handle.bind(editPlaylistController)));

//VIDEO MANAGEMENT ROUTES
trainerRoutes.post("/videos",videoSchema,validate,asyncHandler(addVideoController.handle.bind(addVideoController)));
trainerRoutes.patch("/videos/:videoId",asyncHandler(updateVideoStatusController.handle.bind(updateVideoStatusController)));
trainerRoutes.put("/videos/:videoId",asyncHandler(editVideoController.handle.bind(editVideoController)));
trainerRoutes.get("/videos",asyncHandler(getAllVideosController.handle.bind(getAllVideosController)));

//SLOT MANAGEMENT
trainerRoutes.post("/slots",slotSchema,validate,asyncHandler(createBookingSlotController.handle.bind(createBookingSlotController)));
trainerRoutes.get("/slots",asyncHandler(getPendingSlotsController.handle.bind(getPendingSlotsController)));
trainerRoutes.delete("/slots/:bookingSlotId",asyncHandler(deleteBookingSlotController.handle.bind(deleteBookingSlotController)));

//BOOKING ROUTES
trainerRoutes.get("/bookings",asyncHandler(getBookingRequestsController.handle.bind(getBookingRequestsController)));
trainerRoutes.patch("/bookings",asyncHandler(updateAppointmentController.handle.bind(updateAppointmentController)));

//APPOINTMENT ROUTES
trainerRoutes.get("/appointments",asyncHandler(getTrainerSchedulesController.handle.bind(getTrainerSchedulesController)));
trainerRoutes.patch("/appointments/:appointmentId",asyncHandler(cancelAppointmentController.handle.bind(cancelAppointmentController)));
trainerRoutes.get("/video-call-logs",asyncHandler(getTrainerVideoCallLogController.handle.bind(getTrainerVideoCallLogController)));

//DASHBOARD ROUTES
trainerRoutes.get("/dashboard",asyncHandler(trainerDashboardController.handle.bind(trainerDashboardController)));

//PROFILE UPDATION ROUTES
trainerRoutes.put("/profile",asyncHandler(updateTrainerProfileController.handle.bind(updateTrainerProfileController)));

export default trainerRoutes;
