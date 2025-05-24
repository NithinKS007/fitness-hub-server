import express from "express"
import { authenticate } from "../middlewares/authenticate"
import { TrainerDisplayController } from "../controllers/trainer/trainerDisplayController"
import { BookingController } from "../controllers/booking/bookingController"
import { AuthController } from "../controllers/auth/authController"
import { WorkoutController } from "../controllers/workout/workOutController"
import { UserDashboardController } from "../controllers/dashboard/userDashBoardController"
import { VideoCallLogController } from "../controllers/videoCallLog/videoCallLogController"
import { AppointmentController } from "../controllers/appointment/appointmentController"
import { PlayListController } from "../controllers/playlist/playListController"
import { VideoController } from "../controllers/video/videoController"
import { WebhookController } from "../controllers/subscription/webhookController"
import { UserSubscriptionController } from "../controllers/subscription/userSubscriptionController"
import { PurchaseSubscriptionController } from "../controllers/subscription/purchaseSubscriptionController"
import expressAsyncHandler from "express-async-handler"

const userRoutes = express.Router()

//TRAINER DISPLAYING ROUTES
userRoutes.get("/trainers",expressAsyncHandler(TrainerDisplayController.getApprovedTrainers))
userRoutes.get("/trainers/:trainerId",expressAsyncHandler(TrainerDisplayController.getApprovedTrainerDetailsWithSub))
userRoutes.get("/my-trainers",authenticate,expressAsyncHandler(TrainerDisplayController.getMyTrainers))

//SUBSCRIPTION ROUTES
userRoutes.post("/subscriptions/checkout",authenticate,expressAsyncHandler(PurchaseSubscriptionController.purchaseSubscription))
userRoutes.get("/subscriptions",authenticate,expressAsyncHandler(UserSubscriptionController.getUserSubscriptions))
userRoutes.get("/subscriptions/verify/:sessionId",authenticate,expressAsyncHandler(WebhookController.getSubscriptionBySession))
userRoutes.patch("/subscriptions/cancel",authenticate,expressAsyncHandler(PurchaseSubscriptionController.cancelSubscription)) 
userRoutes.get("/subscriptions/status/:_id",authenticate,expressAsyncHandler(UserSubscriptionController.isSubscribedToTheTrainer))

//VIDEO ROUTES
userRoutes.get("/trainer/videos/:trainerId",authenticate,expressAsyncHandler(VideoController.getPublicVideos))
userRoutes.get("/videos/:videoId",authenticate,expressAsyncHandler(VideoController.getVideoById))

//PLAYLIST ROUTES
userRoutes.get("/playlists/all/:trainerId",authenticate,expressAsyncHandler(PlayListController.getallPlayLists))

//BOOKING ROUTES
userRoutes.get("/slots/all/:trainerId",authenticate,expressAsyncHandler(BookingController.getAllAvailableSlotsFromToday))
userRoutes.get("/slots/:trainerId",authenticate,expressAsyncHandler(BookingController.getAvailableSlotsFromToday))
userRoutes.post("/slots/:slotId",authenticate,expressAsyncHandler(AppointmentController.bookAppointment))

//APPOINTMENT ROUTES
userRoutes.get("/appointments",authenticate,expressAsyncHandler(AppointmentController.getUserBookingSchedules))
userRoutes.patch("/appointments/:appointmentId",authenticate,expressAsyncHandler(AppointmentController.cancelAppointment))
userRoutes.get("/video-call-logs",authenticate,expressAsyncHandler(VideoCallLogController.getUserVideoCallLogs))

//PROFILE ROUTES
userRoutes.put("/profile",authenticate,expressAsyncHandler(AuthController.updateUserProfile))

//WORKOUT ROUTES
userRoutes.post("/workouts",authenticate,expressAsyncHandler(WorkoutController.addWorkout))
userRoutes.get("/workouts",authenticate,expressAsyncHandler(WorkoutController.getWorkoutsByUserId))
userRoutes.delete("/workouts/:setId",authenticate,expressAsyncHandler(WorkoutController.deleteWorkoutSet))
userRoutes.patch("/workouts/:setId",authenticate,expressAsyncHandler(WorkoutController.markSetAsCompleted))

//DASHBOARD ROUTES
userRoutes.get("/dashBoard",authenticate,expressAsyncHandler(UserDashboardController.getUserDashBoardData))


export default userRoutes

