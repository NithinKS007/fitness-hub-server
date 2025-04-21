import express from "express"
import { SubscriptionController } from "../controllers/subscriptionController"
import { authenticate } from "../middlewares/authenticate"
import { BookingController } from "../controllers/bookingController"
import { AuthController } from "../controllers/authController"
import { ContentController } from "../controllers/contentController"
import { TrainerDashboardController } from "../controllers/trainerDashBoardController"
const trainerRoutes = express.Router()

// SUBSCRIPTION ROUTES
trainerRoutes.post("/add-subscription",authenticate,SubscriptionController.addSubscription)
trainerRoutes.get("/subscriptions",authenticate,SubscriptionController.getTrainerSubscriptions)
trainerRoutes.patch("/subscriptions/:subscriptionId",authenticate,SubscriptionController.updateSubscriptionBlockStatus)
trainerRoutes.put("/subscriptions/:subscriptionId",authenticate,SubscriptionController.editSubscription)
trainerRoutes.delete("/subscriptions/:subscriptionId",authenticate,SubscriptionController.deleteSubscription)
trainerRoutes.get("/subscribers",authenticate,SubscriptionController.getTrainerSubscribedUsers)

//CONTENT MANAGEMENT ROUTES
trainerRoutes.post("/create-playlist",authenticate,ContentController.addPlaylist)
trainerRoutes.get("/playlists",authenticate,ContentController.getTrainerPlaylists)
trainerRoutes.get("/playlist-all",authenticate,ContentController.getallPlayLists)
trainerRoutes.post("/upload-video/",authenticate,ContentController.addVideo)
trainerRoutes.patch("/videos/:videoId",authenticate,ContentController.updateVideoBlockStatus)
trainerRoutes.put("/videos/:videoId",authenticate,ContentController.editVideo)
trainerRoutes.patch("/playlist/:playListId",authenticate,ContentController.updatePlayListBlockStatus)
trainerRoutes.put("/playlist/:playListId",authenticate,ContentController.editPlayList)
trainerRoutes.get("/videos",authenticate,ContentController.getTrainerVideos)

//SLOT MANAGEMENT AND BOOKING ROUTES
trainerRoutes.post("/add-slot",authenticate,BookingController.addBookingSlot)
trainerRoutes.get("/available-slots",authenticate,BookingController.getAvailableSlots)
trainerRoutes.get("/booking-requests",authenticate,BookingController.getBookingRequests)
trainerRoutes.patch("/approve-reject-booking",authenticate,BookingController.handleBookingRequest)
trainerRoutes.get("/appointment-schedules",authenticate,BookingController.getTrainerBookingSchedules)
trainerRoutes.patch("/cancel-appointment-schedule/:appointmentId",authenticate,BookingController.cancelAppointment)
trainerRoutes.delete("/delete-booking-slot/:bookingSlotId",authenticate,BookingController.deleteBookingSlot)
trainerRoutes.get("/video-call-logs",authenticate,BookingController.getVideoCallLogsTrainer)
trainerRoutes.get("/dashboard",authenticate,TrainerDashboardController.getTrainerDashBoardData)

//PROFILE UPDATION ROUTES
trainerRoutes.put("/update-profile",authenticate,AuthController.updateTrainerProfile)


export default trainerRoutes