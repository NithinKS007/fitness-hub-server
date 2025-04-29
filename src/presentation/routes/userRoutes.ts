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
userRoutes.post("/checkout-subscription-session/",authenticate,PurchaseSubscriptionController.purchaseSubscription)
userRoutes.get("/subscriptions",authenticate,UserSubscriptionController.getUserSubscriptions)
userRoutes.get("/verify-subscriptions/:sessionId",authenticate,WebhookController.getSubscriptionBySession)
userRoutes.patch("/cancel-subscriptions",authenticate,PurchaseSubscriptionController.cancelSubscription) 
userRoutes.get("/trainer-subscription-status/:_id",authenticate,UserSubscriptionController.isSubscribedToTheTrainer)

//VIDEO ROUTES
userRoutes.get("/videos/:trainerId",authenticate,VideoController.getVideos)
userRoutes.get("/video-details/:videoId",authenticate,VideoController.getVideoById)

//PLAYLIST ROUTES
userRoutes.get("/video-playlist/:trainerId",authenticate,PlayListController.getallPlayLists)

//BOOKING ROUTES
userRoutes.get("/booking-slots/:trainerId",authenticate,BookingController.getAllAvailableSlotsFromToday)
userRoutes.get("/available-slots/:trainerId",authenticate,BookingController.getAvailableSlotsFromToday)
userRoutes.post("/book-slot/:slotId",authenticate,AppointmentController.bookAppointment)
userRoutes.get("/appointment-schedules",authenticate,AppointmentController.getUserBookingSchedules)
userRoutes.patch("/cancel-appointment-schedule/:appointmentId",authenticate,AppointmentController.cancelAppointment)
userRoutes.get("/video-call-logs",authenticate,VideoCallLogController.getUserVideoCallLogs)

//PROFILE ROUTES
userRoutes.put("/update-profile",authenticate,AuthController.updateUserProfile)

//WORKOUT ROUTES
userRoutes.post("/add-workout",authenticate,WorkoutController.addWorkout)
userRoutes.get("/workouts",authenticate,WorkoutController.getWorkoutsByUserId)
userRoutes.delete("/delete-workout-set/:setId",authenticate,WorkoutController.deleteWorkoutSet)
userRoutes.patch("/complete-workout-set/:setId",authenticate,WorkoutController.markSetAsCompleted)
userRoutes.get("/dashBoard",authenticate,UserDashboardController.getUserDashBoardData)


export default userRoutes

