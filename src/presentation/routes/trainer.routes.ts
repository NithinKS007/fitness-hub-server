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
} from "di/container-resolver";

const trainerRoutes = express.Router();

// SUBSCRIPTION ROUTES
trainerRoutes.post("/subscriptions",authenticate,asyncHandler(createSubPlanController.handle.bind(createSubPlanController)));
trainerRoutes.get("/subscriptions",authenticate,asyncHandler(getTrainerSubscriptionController.handle.bind(getTrainerSubscriptionController)));
trainerRoutes.patch("/subscriptions/:subscriptionId",authenticate,asyncHandler(blockSubPlanController.handle.bind(blockSubPlanController)));
trainerRoutes.put("/subscriptions/:subscriptionId",authenticate,asyncHandler(editSubPlanController.handle.bind(editSubPlanController)));
trainerRoutes.delete("/subscriptions/:subscriptionId",authenticate,asyncHandler(deleteSubPlanController.handle.bind(deleteSubPlanController)));
trainerRoutes.get("/subscribers",authenticate,asyncHandler(getTrainerSubscribersController.handle.bind(getTrainerSubscribersController)));

//PLAYLIST MANAGEMENT ROUTES
trainerRoutes.post("/playlists",authenticate,asyncHandler(createPlaylistController.handle.bind(createPlaylistController)));
trainerRoutes.get("/playlists",authenticate,asyncHandler(getPlaylistController.handle.bind(getPlaylistController)));
trainerRoutes.get("/playlists/all",authenticate,asyncHandler(getAllPlaylistController.handle.bind(getAllPlaylistController)));
trainerRoutes.patch("/playlists/:playListId",authenticate,asyncHandler(updatePlaylistPrivacyController.handle.bind(updatePlaylistPrivacyController)));
trainerRoutes.put("/playlists/:playListId",authenticate,asyncHandler(editPlaylistController.handle.bind(editPlaylistController)));

//VIDEO MANAGEMENT ROUTES
trainerRoutes.post("/videos",authenticate,asyncHandler(addVideoController.handle.bind(addVideoController)));
trainerRoutes.patch("/videos/:videoId",authenticate,asyncHandler(updateVideoStatusController.handle.bind(updateVideoStatusController)));
trainerRoutes.put("/videos/:videoId",authenticate,asyncHandler(editVideoController.handle.bind(editVideoController)));
trainerRoutes.get("/videos",authenticate,asyncHandler(getAllVideosController.handle.bind(getAllVideosController)));

//SLOT MANAGEMENT
trainerRoutes.post("/slots",authenticate,asyncHandler(createBookingSlotController.handle.bind(createBookingSlotController)));
trainerRoutes.get("/slots",authenticate,asyncHandler(getPendingSlotsController.handle.bind(getPendingSlotsController)));
trainerRoutes.delete("/slots/:bookingSlotId",authenticate,asyncHandler(deleteBookingSlotController.handle.bind(deleteBookingSlotController)));

//BOOKING ROUTES
trainerRoutes.get("/bookings",authenticate,asyncHandler(getBookingRequestsController.handle.bind(getBookingRequestsController)));
trainerRoutes.patch("/bookings",authenticate,asyncHandler(updateAppointmentController.handle.bind(updateAppointmentController)));

//APPOINTMENT ROUTES
trainerRoutes.get("/appointments",authenticate,asyncHandler(getTrainerSchedulesController.handle.bind(getTrainerSchedulesController)));
trainerRoutes.patch("/appointments/:appointmentId",authenticate,asyncHandler(cancelAppointmentController.handle.bind(cancelAppointmentController)));
trainerRoutes.get("/video-call-logs",authenticate,asyncHandler(getTrainerVideoCallLogController.handle.bind(getTrainerVideoCallLogController)));

//DASHBOARD ROUTES
trainerRoutes.get("/dashboard",authenticate,asyncHandler(trainerDashboardController.handle.bind(trainerDashboardController)));

//PROFILE UPDATION ROUTES
trainerRoutes.put("/profile",authenticate,asyncHandler(updateTrainerProfileController.handle.bind(updateTrainerProfileController)));

export default trainerRoutes;
