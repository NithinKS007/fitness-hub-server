import express from "express"
import { authenticate } from "../middlewares/authenticate"
import { TrainerDisplayController } from "../controllers/trainerDisplayController"
import { SubscriptionController } from "../controllers/subscriptionController"
import { BookingController } from "../controllers/bookingController"
import { ContentController } from "../controllers/contentController"
import { AuthController } from "../controllers/authController"

const userRoutes = express.Router()

//TRAINER DISPLAYING ROUTES
userRoutes.get("/trainers",TrainerDisplayController.getApprovedTrainers)
userRoutes.get("/trainers/:_id",TrainerDisplayController.getApprovedTrainerDetailsWithSub)

//SUBSCRIPTION ROUTES
userRoutes.post("/checkout-subscription-session/",authenticate,SubscriptionController.purchaseSubscription)
userRoutes.get("/subscriptions",authenticate,SubscriptionController.getUserSubscriptions)
userRoutes.get("/verify-subscriptions/:sessionId",authenticate,SubscriptionController.getSubscriptionDetailsBySessionId)
userRoutes.patch("/cancel-subscriptions",authenticate,SubscriptionController.cancelSubscription) 
userRoutes.get("/trainer-subscription-status/:_id",authenticate,SubscriptionController.isSubscribedToTheTrainer)

//CONTENT ROUTES
userRoutes.get("/video-playlist/:trainerId",authenticate,ContentController.getPlayListsByTrainerId)
userRoutes.get("/videos/:playListId",authenticate,ContentController.getVideosByPlaylistId)
userRoutes.get("/video-details/:videoId",authenticate,ContentController.getVideoById)
userRoutes.get("/related-videos/:playListId",authenticate,ContentController.getRelatedVideos)

//BOOKING ROUTES
userRoutes.get("/booking-slots/:trainerId",authenticate,BookingController.getTrainerBookingSlots)
userRoutes.post("/book-slot/:slotId",authenticate,BookingController.bookAppointment)
userRoutes.get("/appointment-schedules",authenticate,BookingController.getUserBookingSchedules)
userRoutes.patch("/cancel-appointment-schedule/:appointmentId",authenticate,BookingController.cancelAppointment)
userRoutes.get("/video-call-logs",authenticate,BookingController.getUserVideoCallLogs)

//PROFILE ROUTES
userRoutes.put("/update-profile",authenticate,AuthController.updateUserProfile)

export default userRoutes

