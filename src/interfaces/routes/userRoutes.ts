import express from "express"
import { authenticate } from "../middlewares/authenticate"
import { UserController } from "../../application/controllers/userController"
import { SubscriptionController } from "../../application/controllers/subscriptionController"

const userRoutes = express.Router()
//TRAINER RELATED ROUTES
userRoutes.get("/trainers",UserController.getApprovedTrainers)
userRoutes.get("/trainers/:_id",UserController.getApprovedTrainerDetailsWithSub)

//SUBSCRIPTION RELATED ROUTES
userRoutes.post("/checkout-subscription-session/",authenticate,SubscriptionController.purchaseSubscription)
userRoutes.get("/subscriptions",authenticate,UserController.getUserSubscriptions)
userRoutes.get("/verify-subscriptions/:sessionId",authenticate,SubscriptionController.getSubscriptionDetailsBySessionId)
userRoutes.patch("/cancel-subscriptions",authenticate,SubscriptionController.cancelSubscription) 
userRoutes.get("/trainer-subscription-status/:_id",authenticate,UserController.isSubscribedToTheTrainer)

//CONTENT ROUTES
userRoutes.get("/video-playlist/:_id",authenticate,UserController.getPlayListsOfTrainer)

//BOOKING ROUTES
userRoutes.get("/booking-slots/:trainerId",authenticate,UserController.getBookingSlotsOfTrainer)
userRoutes.post("/book-slot/:slotId",authenticate,UserController.bookAppointment)
userRoutes.get("/appointment-schedules",authenticate,UserController.getBookingSchedulesUser)
userRoutes.patch("/cancel-appointment-schedule/:appointmentId",authenticate,UserController.cancelAppointmentSchedule)

// USER PROFILE ROUTE
userRoutes.put("/update-profile",authenticate,UserController.updateUserProfile)

export default userRoutes