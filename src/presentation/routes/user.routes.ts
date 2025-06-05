import express from "express"
import { authenticate } from "../middlewares/auth.middleware"
import expressAsyncHandler from "express-async-handler"
import { 
  bookAppointmentController, 
  getAppointmentController, 
  updateAppointmentController,
  getVideoController, 
  profileController, 
  purchaseSubscriptionController, 
  userDashBoardController, 
  userSubscriptionController,  
  getUserVideoCallLogController, 
  webhookController, 
  getBookingSlotController,
  getPlaylistController,
  getUserMyTrainersController,
  getTrainerWithSubController,
  getApprovedTrainersController,
  addWorkoutController,
  getWorkoutController,
  deleteWorkoutController,
  updateWorkoutController
} from "../../di/di";

const userRoutes = express.Router()

//TRAINER DISPLAYING ROUTES
userRoutes.get("/trainers",expressAsyncHandler(getApprovedTrainersController.handleGetApprovedTrainers.bind(getApprovedTrainersController)))
userRoutes.get("/trainers/:trainerId",expressAsyncHandler(getTrainerWithSubController.handleGetTrainerWithSub.bind(getTrainerWithSubController)))
userRoutes.get("/my-trainers",authenticate,expressAsyncHandler(getUserMyTrainersController.handleGetMyTrainers.bind(getUserMyTrainersController)))

//SUBSCRIPTION ROUTES
userRoutes.post("/subscriptions/checkout",authenticate,expressAsyncHandler(purchaseSubscriptionController.purchaseSubscription.bind(purchaseSubscriptionController)))
userRoutes.get("/subscriptions",authenticate,expressAsyncHandler(userSubscriptionController.getUserSubscriptions.bind(userSubscriptionController)))
userRoutes.get("/subscriptions/verify/:sessionId",authenticate,expressAsyncHandler(webhookController.getSubscriptionBySession.bind(webhookController)))
userRoutes.patch("/subscriptions/cancel",authenticate,expressAsyncHandler(purchaseSubscriptionController.cancelSubscription.bind(purchaseSubscriptionController))) 
userRoutes.get("/subscriptions/status/:_id",authenticate,expressAsyncHandler(userSubscriptionController.isSubscribedToTheTrainer.bind(userSubscriptionController)))

//VIDEO ROUTES
userRoutes.get("/trainer/videos/:trainerId",authenticate,expressAsyncHandler(getVideoController.getPublicVideos.bind(getVideoController)))
userRoutes.get("/videos/:videoId",authenticate,expressAsyncHandler(getVideoController.getVideoById.bind(getVideoController)))

//PLAYLIST ROUTES
userRoutes.get("/playlists/all/:trainerId",authenticate,expressAsyncHandler(getPlaylistController.getallPlayLists.bind(getPlaylistController)))

//BOOKING ROUTES
userRoutes.get("/slots/all/:trainerId",authenticate,expressAsyncHandler(getBookingSlotController.getAllAvailableSlots.bind(getBookingSlotController)))
userRoutes.get("/slots/:trainerId",authenticate,expressAsyncHandler(getBookingSlotController.getUpcomingSlots.bind(getBookingSlotController)))
userRoutes.post("/slots/:slotId",authenticate,expressAsyncHandler(bookAppointmentController.handleBookAppointment.bind(bookAppointmentController)))

//APPOINTMENT ROUTES
userRoutes.get("/appointments",authenticate,expressAsyncHandler(getAppointmentController.handleGetUserSchedules.bind(getAppointmentController)))
userRoutes.patch("/appointments/:appointmentId",authenticate,expressAsyncHandler(updateAppointmentController.handleCancelAppointment.bind(updateAppointmentController)))
userRoutes.get("/video-call-logs",authenticate,expressAsyncHandler(getUserVideoCallLogController.handleGetUserLogs.bind(getUserVideoCallLogController)))

//PROFILE ROUTES
userRoutes.put("/profile",authenticate,expressAsyncHandler(profileController.updateUserProfile.bind(profileController)))

//WORKOUT ROUTES
userRoutes.post("/workouts",authenticate,expressAsyncHandler(addWorkoutController.handleAddWorkout.bind(addWorkoutController)))
userRoutes.get("/workouts",authenticate,expressAsyncHandler(getWorkoutController.handleGetWorkout.bind(getWorkoutController)))
userRoutes.delete("/workouts/:setId",authenticate,expressAsyncHandler(deleteWorkoutController.handleDeleteWorkout.bind(deleteWorkoutController)))
userRoutes.patch("/workouts/:setId",authenticate,expressAsyncHandler(updateWorkoutController.handlWorkoutComplete.bind(updateWorkoutController)))

//DASHBOARD ROUTES
userRoutes.get("/dashBoard",authenticate,expressAsyncHandler(userDashBoardController.getUserDashBoardData.bind(userDashBoardController)))


export default userRoutes

