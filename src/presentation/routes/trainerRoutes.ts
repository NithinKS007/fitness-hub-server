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
trainerRoutes.post("/subscriptions",authenticate,SubscriptionPlanController.addSubscription)
trainerRoutes.get("/subscriptions",authenticate,TrainerSubscriptionController.getTrainerSubscriptions)
trainerRoutes.patch("/subscriptions/:subscriptionId",authenticate,SubscriptionPlanController.updateSubscriptionBlockStatus)
trainerRoutes.put("/subscriptions/:subscriptionId",authenticate,SubscriptionPlanController.editSubscription)
trainerRoutes.delete("/subscriptions/:subscriptionId",authenticate,SubscriptionPlanController.deleteSubscription)
trainerRoutes.get("/subscribers",authenticate,TrainerSubscriptionController.getTrainerSubscribedUsers)

//PLAYLIST MANAGEMENT ROUTES
trainerRoutes.post("/playlists",authenticate,PlayListController.addPlaylist)
trainerRoutes.get("/playlists",authenticate,PlayListController.getPlaylists)
trainerRoutes.get("/playlists/all",authenticate,PlayListController.getallPlayLists)
trainerRoutes.patch("/playlists/:playListId",authenticate,PlayListController.updatePlayListPrivacy)
trainerRoutes.put("/playlists/:playListId",authenticate,PlayListController.editPlayList)

//VIDEO MANAGEMENT ROUTES
trainerRoutes.post("/videos/",authenticate,VideoController.addVideo)
trainerRoutes.patch("/videos/:videoId",authenticate,VideoController.updateVideoPrivacy)
trainerRoutes.put("/videos/:videoId",authenticate,VideoController.editVideo)
trainerRoutes.get("/videos",authenticate,VideoController.getVideos)

//SLOT MANAGEMENT
trainerRoutes.post("/slots",authenticate,BookingController.addBookingSlot)
trainerRoutes.get("/slots",authenticate,BookingController.getAvailableSlots)
trainerRoutes.delete("/slots/:bookingSlotId",authenticate,BookingController.deleteBookingSlot)

//BOOKING ROUTES
trainerRoutes.get("/bookings",authenticate,AppointmentController.getBookingRequests)
trainerRoutes.patch("/bookings",authenticate,AppointmentController.handleBookingRequest)

//APPOINTMENT ROUTES
trainerRoutes.get("/appointments",authenticate,AppointmentController.getTrainerBookingSchedules)
trainerRoutes.patch("/appointments/:appointmentId",authenticate,AppointmentController.cancelAppointment)
trainerRoutes.get("/video-call-logs",authenticate,VideoCallLogController.getVideoCallLogsTrainer)

//DASHBOARD ROUTES
trainerRoutes.get("/dashboard",authenticate,TrainerDashboardController.getTrainerDashBoardData)

//PROFILE UPDATION ROUTES
trainerRoutes.put("/profile",authenticate,AuthController.updateTrainerProfile)


export default trainerRoutes