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

const userRoutes = express.Router()

//TRAINER DISPLAYING ROUTES
userRoutes.get("/trainers",TrainerDisplayController.getApprovedTrainers)
userRoutes.get("/trainers/:trainerId",TrainerDisplayController.getApprovedTrainerDetailsWithSub)
userRoutes.get("/my-trainers",authenticate,TrainerDisplayController.getMyTrainers)

//SUBSCRIPTION ROUTES
userRoutes.post("/subscriptions/checkout",authenticate,PurchaseSubscriptionController.purchaseSubscription)
userRoutes.get("/subscriptions",authenticate,UserSubscriptionController.getUserSubscriptions)
userRoutes.get("/subscriptions/verify/:sessionId",authenticate,WebhookController.getSubscriptionBySession)
userRoutes.patch("/subscriptions/cancel",authenticate,PurchaseSubscriptionController.cancelSubscription) 
userRoutes.get("/subscriptions/status/:_id",authenticate,UserSubscriptionController.isSubscribedToTheTrainer)

//VIDEO ROUTES
userRoutes.get("/trainer/videos/:trainerId",authenticate,VideoController.getPublicVideos)
userRoutes.get("/videos/:videoId",authenticate,VideoController.getVideoById)

//PLAYLIST ROUTES
userRoutes.get("/playlists/all/:trainerId",authenticate,PlayListController.getallPlayLists)

//BOOKING ROUTES
userRoutes.get("/slots/all/:trainerId",authenticate,BookingController.getAllAvailableSlotsFromToday)
userRoutes.get("/slots/:trainerId",authenticate,BookingController.getAvailableSlotsFromToday)
userRoutes.post("/slots/:slotId",authenticate,AppointmentController.bookAppointment)

//APPOINTMENT ROUTES
userRoutes.get("/appointments",authenticate,AppointmentController.getUserBookingSchedules)
userRoutes.patch("/appointments/:appointmentId",authenticate,AppointmentController.cancelAppointment)
userRoutes.get("/video-call-logs",authenticate,VideoCallLogController.getUserVideoCallLogs)

//PROFILE ROUTES
userRoutes.put("/profile",authenticate,AuthController.updateUserProfile)

//WORKOUT ROUTES
userRoutes.post("/workouts",authenticate,WorkoutController.addWorkout)
userRoutes.get("/workouts",authenticate,WorkoutController.getWorkoutsByUserId)
userRoutes.delete("/workouts/:setId",authenticate,WorkoutController.deleteWorkoutSet)
userRoutes.patch("/workouts/:setId",authenticate,WorkoutController.markSetAsCompleted)

//DASHBOARD ROUTES
userRoutes.get("/dashBoard",authenticate,UserDashboardController.getUserDashBoardData)


export default userRoutes

