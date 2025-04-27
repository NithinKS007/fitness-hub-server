import express from "express"
import { authenticate } from "../middlewares/authenticate"
import { BookingController } from "../controllers/booking/bookingController"
import { AuthController } from "../controllers/auth/authController"
import { TrainerDashboardController } from "../controllers/dashboard/trainerDashBoardController"
import { VideoCallLogController } from "../controllers/videoCallLog/videoCallLogController"
import { AppointmentController } from "../controllers/appointment/appointmentController"
import { PlayListController } from "../controllers/playlist/playListController"
import { VideoController } from "../controllers/video/videoController"
import { SubscriptionPlanController } from "../controllers/subscription/subscriptionPlanController"
import { TrainerSubscriptionController } from "../controllers/subscription/trainerSubscriptionController"
const trainerRoutes = express.Router()

// SUBSCRIPTION ROUTES
trainerRoutes.post("/add-subscription",authenticate,SubscriptionPlanController.addSubscription)
trainerRoutes.get("/subscriptions",authenticate,TrainerSubscriptionController.getTrainerSubscriptions)
trainerRoutes.patch("/subscriptions/:subscriptionId",authenticate,SubscriptionPlanController.updateSubscriptionBlockStatus)
trainerRoutes.put("/subscriptions/:subscriptionId",authenticate,SubscriptionPlanController.editSubscription)
trainerRoutes.delete("/subscriptions/:subscriptionId",authenticate,SubscriptionPlanController.deleteSubscription)
trainerRoutes.get("/subscribers",authenticate,TrainerSubscriptionController.getTrainerSubscribedUsers)

//PLAYLIST MANAGEMENT ROUTES
trainerRoutes.post("/create-playlist",authenticate,PlayListController.addPlaylist)
trainerRoutes.get("/playlists",authenticate,PlayListController.getPlaylists)
trainerRoutes.get("/playlist-all",authenticate,PlayListController.getallPlayLists)
trainerRoutes.patch("/playlist/:playListId",authenticate,PlayListController.updatePlayListPrivacy)
trainerRoutes.put("/playlist/:playListId",authenticate,PlayListController.editPlayList)

//VIDEO MANAGEMENT ROUTES
trainerRoutes.post("/upload-video/",authenticate,VideoController.addVideo)
trainerRoutes.patch("/videos/:videoId",authenticate,VideoController.updateVideoPrivacy)
trainerRoutes.put("/videos/:videoId",authenticate,VideoController.editVideo)
trainerRoutes.get("/videos",authenticate,VideoController.getVideos)

//SLOT MANAGEMENT AND BOOKING ROUTES
trainerRoutes.post("/add-slot",authenticate,BookingController.addBookingSlot)
trainerRoutes.get("/available-slots",authenticate,BookingController.getAvailableSlots)
trainerRoutes.get("/booking-requests",authenticate,AppointmentController.getBookingRequests)
trainerRoutes.patch("/approve-reject-booking",authenticate,AppointmentController.handleBookingRequest)
trainerRoutes.get("/appointment-schedules",authenticate,AppointmentController.getTrainerBookingSchedules)
trainerRoutes.patch("/cancel-appointment-schedule/:appointmentId",authenticate,AppointmentController.cancelAppointment)
trainerRoutes.delete("/delete-booking-slot/:bookingSlotId",authenticate,BookingController.deleteBookingSlot)
trainerRoutes.get("/video-call-logs",authenticate,VideoCallLogController.getVideoCallLogsTrainer)
trainerRoutes.get("/dashboard",authenticate,TrainerDashboardController.getTrainerDashBoardData)

//PROFILE UPDATION ROUTES
trainerRoutes.put("/update-profile",authenticate,AuthController.updateTrainerProfile)


export default trainerRoutes