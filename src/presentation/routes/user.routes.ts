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

//USER TRAINERS DISPLAYING ROUTES
userRoutes.get("/trainers",asyncHandler(getUserMyTrainersController.handle.bind(getUserMyTrainersController)));

//SUBSCRIPTION ROUTES
userRoutes.post("/subscriptions/checkout",asyncHandler(purchaseSubscriptionController.handle.bind(purchaseSubscriptionController)));
userRoutes.get("/subscriptions",asyncHandler(getUserSubscriptionController.handle.bind(getUserSubscriptionController)));
userRoutes.get("/subscriptions/:id/verify",asyncHandler(verifySubscriptionController.handle.bind(verifySubscriptionController)));
userRoutes.patch("/subscriptions/cancel",asyncHandler(cancelSubscriptionController.handle.bind(cancelSubscriptionController)));
userRoutes.get("/subscriptions/trainers/:id/status/",asyncHandler(checkSubscriptionStatusController.handle.bind(checkSubscriptionStatusController)));

//VIDEO ROUTES
userRoutes.get("/trainers/:id/videos",asyncHandler(getPublicVideosController.handle.bind(getPublicVideosController)));
userRoutes.get("/trainers/:trainerId/videos/:videoId",asyncHandler(getPublicVideoDetailsController.handle.bind(getPublicVideoDetailsController)));

//PLAYLIST ROUTES
userRoutes.get("/trainers/:id/playlists",asyncHandler(getAllPublicPlaylistController.handle.bind(getAllPublicPlaylistController)));

//BOOKING ROUTES
userRoutes.get("/trainers/:id/slots",asyncHandler(getUpComingSlotsController.handle.bind(getUpComingSlotsController)));
userRoutes.get("/trainers/:id/slots/calender",asyncHandler(getUpComingSlotsController.handle.bind(getUpComingSlotsController)));
userRoutes.post("/trainers/:trainerId/slots/:slotId",asyncHandler(bookAppointmentController.handle.bind(bookAppointmentController)));

//APPOINTMENT ROUTES
userRoutes.get("/appointments",asyncHandler(getUserSchedulesController.handle.bind(getUserSchedulesController)));
userRoutes.patch("/appointments/:id",asyncHandler(cancelAppointmentController.handle.bind(cancelAppointmentController)));
userRoutes.get("/video-call-logs",asyncHandler(getUserVideoCallLogController.handle.bind(getUserVideoCallLogController)));

//PROFILE ROUTES
userRoutes.put("/profile",asyncHandler(updateUserProfileController.handle.bind(updateUserProfileController)));

//WORKOUT ROUTES
userRoutes.post("/workouts",wrkoutSchema,validate,asyncHandler(addWorkoutController.handle.bind(addWorkoutController)));
userRoutes.get("/workouts",asyncHandler(getWorkoutController.handle.bind(getWorkoutController)));
userRoutes.delete("/workouts/:id",asyncHandler(deleteWorkoutController.handle.bind(deleteWorkoutController)));
userRoutes.patch("/workouts/:id",asyncHandler(updateWorkoutController.handle.bind(updateWorkoutController)));

//DASHBOARD ROUTES
userRoutes.get("/dashBoard",asyncHandler(userDashboardController.handle.bind(userDashboardController)));

export default userRoutes;
