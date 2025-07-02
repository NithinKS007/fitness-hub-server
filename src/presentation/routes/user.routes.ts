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
  getPublicVideoDetailsController,
  getPublicVideosController,
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
} from "@di/container-resolver";
import { wrkoutSchema } from "@presentation/middlewares/validation-schemas/workout-schema";
import { validate } from "@presentation/middlewares/validation.middleware";
import { authorizeRole } from "@presentation/middlewares/autherisation.middleware";

const userRoutes = express.Router();
userRoutes.use(authenticate)
userRoutes.use(authorizeRole(["user"]))

//TRAINER DISPLAYING ROUTES
userRoutes.get("/my-trainers",asyncHandler(getUserMyTrainersController.handle.bind(getUserMyTrainersController)));

//SUBSCRIPTION ROUTES
userRoutes.post("/subscriptions/checkout",asyncHandler(purchaseSubscriptionController.handle.bind(purchaseSubscriptionController)));
userRoutes.get("/subscriptions",asyncHandler(getUserSubscriptionController.handle.bind(getUserSubscriptionController)));
userRoutes.get("/subscriptions/:sessionId/verify",asyncHandler(verifySubscriptionController.handle.bind(verifySubscriptionController)));
userRoutes.patch("/subscriptions/cancel",asyncHandler(cancelSubscriptionController.handle.bind(cancelSubscriptionController)));
userRoutes.get("/subscriptions/:trainerId/status/",asyncHandler(checkSubscriptionStatusController.handle.bind(checkSubscriptionStatusController)));

//VIDEO ROUTES
userRoutes.get("/trainers/:trainerId/videos",asyncHandler(getPublicVideosController.handle.bind(getPublicVideosController)));
userRoutes.get("/videos/:videoId",asyncHandler(getPublicVideoDetailsController.handle.bind(getPublicVideoDetailsController)));

//PLAYLIST ROUTES
userRoutes.get("/playlists/:trainerId",asyncHandler(getAllPublicPlaylistController.handle.bind(getAllPublicPlaylistController)));

//BOOKING ROUTES
userRoutes.get("/slots/:trainerId/available",asyncHandler(getAllPendingSlotsController.handle.bind(getAllPendingSlotsController)));
userRoutes.get("/slots/:trainerId/upcoming",asyncHandler(getUpComingSlotsController.handle.bind(getUpComingSlotsController)));
userRoutes.post("/slots/:slotId",asyncHandler(bookAppointmentController.handle.bind(bookAppointmentController)));

//APPOINTMENT ROUTES
userRoutes.get("/appointments",asyncHandler(getUserSchedulesController.handle.bind(getUserSchedulesController)));
userRoutes.patch("/appointments/:appointmentId",asyncHandler(cancelAppointmentController.handle.bind(cancelAppointmentController)));
userRoutes.get("/video-call-logs",asyncHandler(getUserVideoCallLogController.handle.bind(getUserVideoCallLogController)));

//PROFILE ROUTES
userRoutes.put("/profile",asyncHandler(updateUserProfileController.handle.bind(updateUserProfileController)));

//WORKOUT ROUTES
userRoutes.post("/workouts",wrkoutSchema,validate,asyncHandler(addWorkoutController.handle.bind(addWorkoutController)));
userRoutes.get("/workouts",asyncHandler(getWorkoutController.handle.bind(getWorkoutController)));
userRoutes.delete("/workouts/:setId",asyncHandler(deleteWorkoutController.handle.bind(deleteWorkoutController)));
userRoutes.patch("/workouts/:setId",asyncHandler(updateWorkoutController.handle.bind(updateWorkoutController)));

//DASHBOARD ROUTES
userRoutes.get("/dashBoard",asyncHandler(userDashboardController.handle.bind(userDashboardController)));

export default userRoutes;
