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
import expressAsyncHandler from "express-async-handler";

const trainerRoutes = express.Router()

// SUBSCRIPTION ROUTES
trainerRoutes.post("/subscriptions",authenticate,expressAsyncHandler(SubscriptionPlanController.addSubscription))
trainerRoutes.get("/subscriptions",authenticate,expressAsyncHandler(TrainerSubscriptionController.getTrainerSubscriptions))
trainerRoutes.patch("/subscriptions/:subscriptionId",authenticate,expressAsyncHandler(SubscriptionPlanController.updateSubscriptionBlockStatus))
trainerRoutes.put("/subscriptions/:subscriptionId",authenticate,expressAsyncHandler(SubscriptionPlanController.editSubscription))
trainerRoutes.delete("/subscriptions/:subscriptionId",authenticate,expressAsyncHandler(SubscriptionPlanController.deleteSubscription))
trainerRoutes.get("/subscribers",authenticate,expressAsyncHandler(TrainerSubscriptionController.getTrainerSubscribedUsers))

//PLAYLIST MANAGEMENT ROUTES
trainerRoutes.post("/playlists",authenticate,expressAsyncHandler(PlayListController.addPlaylist))
trainerRoutes.get("/playlists",authenticate,expressAsyncHandler(PlayListController.getPlaylists))
trainerRoutes.get("/playlists/all",authenticate,expressAsyncHandler(PlayListController.getallPlayLists))
trainerRoutes.patch("/playlists/:playListId",authenticate,expressAsyncHandler(PlayListController.updatePlayListPrivacy))
trainerRoutes.put("/playlists/:playListId",authenticate,expressAsyncHandler(PlayListController.editPlayList))

//VIDEO MANAGEMENT ROUTES
trainerRoutes.post("/videos/",authenticate,expressAsyncHandler(VideoController.addVideo))
trainerRoutes.patch("/videos/:videoId",authenticate,expressAsyncHandler(VideoController.updateVideoPrivacy))
trainerRoutes.put("/videos/:videoId",authenticate,expressAsyncHandler(VideoController.editVideo))
trainerRoutes.get("/videos",authenticate,expressAsyncHandler(VideoController.getVideos))

//SLOT MANAGEMENT
trainerRoutes.post("/slots",authenticate,expressAsyncHandler(BookingController.addBookingSlot))
trainerRoutes.get("/slots",authenticate,expressAsyncHandler(BookingController.getAvailableSlots))
trainerRoutes.delete("/slots/:bookingSlotId",authenticate,expressAsyncHandler(BookingController.deleteBookingSlot))

//BOOKING ROUTES
trainerRoutes.get("/bookings",authenticate,expressAsyncHandler(AppointmentController.getBookingRequests))
trainerRoutes.patch("/bookings",authenticate,expressAsyncHandler(AppointmentController.handleBookingRequest))

//APPOINTMENT ROUTES
trainerRoutes.get("/appointments",authenticate,expressAsyncHandler(AppointmentController.getTrainerBookingSchedules))
trainerRoutes.patch("/appointments/:appointmentId",authenticate,expressAsyncHandler(AppointmentController.cancelAppointment))
trainerRoutes.get("/video-call-logs",authenticate,expressAsyncHandler(VideoCallLogController.getVideoCallLogsTrainer))

//DASHBOARD ROUTES
trainerRoutes.get("/dashboard",authenticate,expressAsyncHandler(TrainerDashboardController.getTrainerDashBoardData))

//PROFILE UPDATION ROUTES
trainerRoutes.put("/profile",authenticate,expressAsyncHandler(AuthController.updateTrainerProfile))


export default trainerRoutes