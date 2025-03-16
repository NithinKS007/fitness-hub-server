import express from "express"
import { SubscriptionController } from "../../application/controllers/subscriptionController"
import { authenticate } from "../middlewares/authenticate"
import { TrainerController } from "../../application/controllers/trainerController"
const trainerRoutes = express.Router()

// SUBSCRIPTION ROUTES
trainerRoutes.post("/add-subscription",authenticate,SubscriptionController.addSubscription)
trainerRoutes.get("/subscriptions",authenticate,SubscriptionController.getTrainerSubscriptions)
trainerRoutes.patch("/subscriptions/:_id",authenticate,SubscriptionController.updateSubscriptionBlockStatus)
trainerRoutes.put("/subscriptions/:_id",authenticate,SubscriptionController.editSubscription)
trainerRoutes.delete("/subscriptions/:_id",authenticate,SubscriptionController.deleteSubscription)
trainerRoutes.get("/subscribers",authenticate,TrainerController.getTrainerSubscribedUsers)

//CONTENT MANAGEMENT ROUTES
trainerRoutes.post("/create-playlist",authenticate,TrainerController.addPlaylist)
trainerRoutes.get("/playlists",authenticate,TrainerController.getPlayListsOfTrainer)
trainerRoutes.post("/upload-video/",authenticate,TrainerController.addVideo)
trainerRoutes.get("/videos",authenticate,TrainerController.getVideosOfTrainerByTrainerId)



//SLOT MANAGEMENT AND BOOKING ROUTES
trainerRoutes.post("/add-slot",authenticate,TrainerController.addBookingSlot)
trainerRoutes.get("/available-slots",authenticate,TrainerController.getAvailableSlots)
trainerRoutes.get("/booking-requests",authenticate,TrainerController.getBookingRequests)
trainerRoutes.patch("/approve-reject-booking",authenticate,TrainerController.approveRejectBookingRequest)
trainerRoutes.get("/appointment-schedules",authenticate,TrainerController.getBookingSchedulesForTrainer)
trainerRoutes.patch("/cancel-appointment-schedule/:appointmentId",authenticate,TrainerController.cancelAppointmentSchedule)
trainerRoutes.delete("/delete-booking-slot/:bookingSlotId",authenticate,TrainerController.deleteBookingSlot)


// PROFILE UPDATION ROUTES
trainerRoutes.put("/update-profile",authenticate,TrainerController.updateTrainerProfile)


export default trainerRoutes