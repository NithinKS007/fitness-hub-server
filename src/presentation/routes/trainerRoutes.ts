import express from "express"
import { authenticate } from "../middlewares/authenticate"
import expressAsyncHandler from "express-async-handler";
import { appointmentController, authController, bookingController, playListController, subscriptionPlanController, trainerDashboardController, trainerSubscriptionController, videoCallLogController, videoController } from "../../di/di"

const trainerRoutes = express.Router()

// SUBSCRIPTION ROUTES
trainerRoutes.post("/subscriptions",authenticate,expressAsyncHandler(subscriptionPlanController.addSubscription))
trainerRoutes.get("/subscriptions",authenticate,expressAsyncHandler(trainerSubscriptionController.getTrainerSubscriptions))
trainerRoutes.patch("/subscriptions/:subscriptionId",authenticate,expressAsyncHandler(subscriptionPlanController.updateSubscriptionBlockStatus))
trainerRoutes.put("/subscriptions/:subscriptionId",authenticate,expressAsyncHandler(subscriptionPlanController.editSubscription))
trainerRoutes.delete("/subscriptions/:subscriptionId",authenticate,expressAsyncHandler(subscriptionPlanController.deleteSubscription))
trainerRoutes.get("/subscribers",authenticate,expressAsyncHandler(trainerSubscriptionController.getTrainerSubscribedUsers))

//PLAYLIST MANAGEMENT ROUTES
trainerRoutes.post("/playlists",authenticate,expressAsyncHandler(playListController.addPlaylist))
trainerRoutes.get("/playlists",authenticate,expressAsyncHandler(playListController.getPlaylists))
trainerRoutes.get("/playlists/all",authenticate,expressAsyncHandler(playListController.getallPlayLists))
trainerRoutes.patch("/playlists/:playListId",authenticate,expressAsyncHandler(playListController.updatePlayListPrivacy))
trainerRoutes.put("/playlists/:playListId",authenticate,expressAsyncHandler(playListController.editPlayList))

//VIDEO MANAGEMENT ROUTES
trainerRoutes.post("/videos/",authenticate,expressAsyncHandler(videoController.addVideo))
trainerRoutes.patch("/videos/:videoId",authenticate,expressAsyncHandler(videoController.updateVideoPrivacy))
trainerRoutes.put("/videos/:videoId",authenticate,expressAsyncHandler(videoController.editVideo))
trainerRoutes.get("/videos",authenticate,expressAsyncHandler(videoController.getVideos))

//SLOT MANAGEMENT
trainerRoutes.post("/slots",authenticate,expressAsyncHandler(bookingController.addBookingSlot))
trainerRoutes.get("/slots",authenticate,expressAsyncHandler(bookingController.getAvailableSlots))
trainerRoutes.delete("/slots/:bookingSlotId",authenticate,expressAsyncHandler(bookingController.deleteBookingSlot))

//BOOKING ROUTES
trainerRoutes.get("/bookings",authenticate,expressAsyncHandler(appointmentController.getBookingRequests))
trainerRoutes.patch("/bookings",authenticate,expressAsyncHandler(appointmentController.handleBookingRequest))

//APPOINTMENT ROUTES
trainerRoutes.get("/appointments",authenticate,expressAsyncHandler(appointmentController.getTrainerBookingSchedules))
trainerRoutes.patch("/appointments/:appointmentId",authenticate,expressAsyncHandler(appointmentController.cancelAppointment))
trainerRoutes.get("/video-call-logs",authenticate,expressAsyncHandler(videoCallLogController.getVideoCallLogsTrainer))

//DASHBOARD ROUTES
trainerRoutes.get("/dashboard",authenticate,expressAsyncHandler(trainerDashboardController.getTrainerDashBoardData))

//PROFILE UPDATION ROUTES
trainerRoutes.put("/profile",authenticate,expressAsyncHandler(authController.updateTrainerProfile))


export default trainerRoutes