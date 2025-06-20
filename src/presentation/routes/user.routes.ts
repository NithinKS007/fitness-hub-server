import express from "express";
import { authenticate } from "@presentation/middlewares/auth.middleware";
import { asyncHandler } from "@shared/utils/async-handler";
import {
  addWorkoutController,
  bookAppointmentController,
  cancelAppointmentController,
  cancelSubscriptionController,
  checkSubscriptionStatusController,
  deleteWorkoutController,
  getAllPendingSlotsController,
  getAllPublicPlaylistController,
  getApprovedTrainersController,
  getPublicVideoDetailsController,
  getPublicVideosController,
  getTrainerWithSubController,
  getUpComingSlotsController,
  getUserMyTrainersController,
  getUserSchedulesController,
  getUserSubscriptionController,
  getUserVideoCallLogController,
  getWorkoutController,
  purchaseSubscriptionController,
  updateUserProfileController,
  updateWorkoutController,
  userDashboardController,
  verifySubscriptionController,
} from "di/container-resolver";

const userRoutes = express.Router();

//TRAINER DISPLAYING ROUTES
userRoutes.get("/trainers",asyncHandler(getApprovedTrainersController.handle.bind(getApprovedTrainersController)));
userRoutes.get("/trainers/:trainerId",asyncHandler(getTrainerWithSubController.handle.bind(getTrainerWithSubController)));
userRoutes.get("/my-trainers",authenticate,asyncHandler(getUserMyTrainersController.handle.bind(getUserMyTrainersController)));

//SUBSCRIPTION ROUTES
userRoutes.post("/subscriptions/checkout",authenticate,asyncHandler(purchaseSubscriptionController.handle.bind(purchaseSubscriptionController)));
userRoutes.get("/subscriptions",authenticate,asyncHandler(getUserSubscriptionController.handle.bind(getUserSubscriptionController)));
userRoutes.get("/subscriptions/:sessionId/verify",authenticate,asyncHandler(verifySubscriptionController.handle.bind(verifySubscriptionController)));
userRoutes.patch("/subscriptions/cancel",authenticate,asyncHandler(cancelSubscriptionController.handle.bind(cancelSubscriptionController)));
userRoutes.get("/subscriptions/:trainerId/status/",authenticate,asyncHandler(checkSubscriptionStatusController.handle.bind(checkSubscriptionStatusController)));

//VIDEO ROUTES
userRoutes.get("/trainers/:trainerId/videos",authenticate,asyncHandler(getPublicVideosController.handle.bind(getPublicVideosController)));
userRoutes.get("/videos/:videoId",authenticate,asyncHandler(getPublicVideoDetailsController.handle.bind(getPublicVideoDetailsController)));

//PLAYLIST ROUTES
userRoutes.get("/playlists/:trainerId",authenticate,asyncHandler(getAllPublicPlaylistController.handle.bind(getAllPublicPlaylistController)));

//BOOKING ROUTES
userRoutes.get("/slots/:trainerId/available",authenticate,asyncHandler(getAllPendingSlotsController.handle.bind(getAllPendingSlotsController)));
userRoutes.get("/slots/:trainerId/upcoming",authenticate,asyncHandler(getUpComingSlotsController.handle.bind(getUpComingSlotsController)));
userRoutes.post("/slots/:slotId",authenticate,asyncHandler(bookAppointmentController.handle.bind(bookAppointmentController)));

//APPOINTMENT ROUTES
userRoutes.get("/appointments",authenticate,asyncHandler(getUserSchedulesController.handle.bind(getUserSchedulesController)));
userRoutes.patch("/appointments/:appointmentId",authenticate,asyncHandler(cancelAppointmentController.handle.bind(cancelAppointmentController)));
userRoutes.get("/video-call-logs",authenticate,asyncHandler(getUserVideoCallLogController.handle.bind(getUserVideoCallLogController)));

//PROFILE ROUTES
userRoutes.put("/profile",authenticate,asyncHandler(updateUserProfileController.handle.bind(updateUserProfileController)));

//WORKOUT ROUTES
userRoutes.post("/workouts",authenticate,asyncHandler(addWorkoutController.handle.bind(addWorkoutController)));
userRoutes.get("/workouts",authenticate,asyncHandler(getWorkoutController.handle.bind(getWorkoutController)));
userRoutes.delete("/workouts/:setId",authenticate,asyncHandler(deleteWorkoutController.handle.bind(deleteWorkoutController)));
userRoutes.patch("/workouts/:setId",authenticate,asyncHandler(updateWorkoutController.handle.bind(updateWorkoutController)));

//DASHBOARD ROUTES
userRoutes.get("/dashBoard",authenticate,asyncHandler(userDashboardController.handle.bind(userDashboardController)));

export default userRoutes;
