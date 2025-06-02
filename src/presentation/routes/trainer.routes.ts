import express from "express"
import { authenticate } from "../middlewares/auth.middleware"
import expressAsyncHandler from "express-async-handler";
import { 
  addVideoController, 
  editVideoController, 
  getVideoController, 
  updateVideoStatusController,
  getAppointmentController, 
  updateAppointmentController,
  profileController, 
  subscriptionPlanController, 
  trainerDashboardController, 
  trainerSubscriptionController, 
  trainerVideoCallController, 
  createBookingSlotController,
  getBookingSlotController,
  deleteBookingSlotController,
  addPlaylistController,
  getPlaylistController,
  updatePlaylistcontroller,
  editPlaylistController
} from "../../di/di";

const trainerRoutes = express.Router()

// SUBSCRIPTION ROUTES
trainerRoutes.post("/subscriptions",authenticate,expressAsyncHandler(subscriptionPlanController.addSubscription.bind(subscriptionPlanController)))
trainerRoutes.get("/subscriptions",authenticate,expressAsyncHandler(trainerSubscriptionController.getTrainerSubscriptions.bind(trainerSubscriptionController)))
trainerRoutes.patch("/subscriptions/:subscriptionId",authenticate,expressAsyncHandler(subscriptionPlanController.updateSubscriptionBlockStatus.bind(subscriptionPlanController)))
trainerRoutes.put("/subscriptions/:subscriptionId",authenticate,expressAsyncHandler(subscriptionPlanController.editSubscription.bind(subscriptionPlanController)))
trainerRoutes.delete("/subscriptions/:subscriptionId",authenticate,expressAsyncHandler(subscriptionPlanController.deleteSubscription.bind(subscriptionPlanController)))
trainerRoutes.get("/subscribers",authenticate,expressAsyncHandler(trainerSubscriptionController.getTrainerSubscribedUsers.bind(trainerSubscriptionController)))

//PLAYLIST MANAGEMENT ROUTES
trainerRoutes.post("/playlists",authenticate,expressAsyncHandler(addPlaylistController.addPlaylist.bind(addPlaylistController)))
trainerRoutes.get("/playlists",authenticate,expressAsyncHandler(getPlaylistController.getPlaylists.bind(getPlaylistController)))
trainerRoutes.get("/playlists/all",authenticate,expressAsyncHandler(getPlaylistController.getallPlayLists.bind(getPlaylistController)))
trainerRoutes.patch("/playlists/:playListId",authenticate,expressAsyncHandler(updatePlaylistcontroller.updatePrivacy.bind(updatePlaylistcontroller)))
trainerRoutes.put("/playlists/:playListId",authenticate,expressAsyncHandler(editPlaylistController.editPlayList.bind(editPlaylistController)))

//VIDEO MANAGEMENT ROUTES
trainerRoutes.post("/videos/",authenticate,expressAsyncHandler(addVideoController.addVideo.bind(addVideoController)))
trainerRoutes.patch("/videos/:videoId",authenticate,expressAsyncHandler(updateVideoStatusController.updatePrivacy.bind(updateVideoStatusController)))
trainerRoutes.put("/videos/:videoId",authenticate,expressAsyncHandler(editVideoController.editVideo.bind(editVideoController)))
trainerRoutes.get("/videos",authenticate,expressAsyncHandler(getVideoController.getVideos.bind(getVideoController)))

//SLOT MANAGEMENT
trainerRoutes.post("/slots",authenticate,expressAsyncHandler(createBookingSlotController.addBookingSlot.bind(createBookingSlotController)))
trainerRoutes.get("/slots",authenticate,expressAsyncHandler(getBookingSlotController.getAvailableSlots.bind(getBookingSlotController)))
trainerRoutes.delete("/slots/:bookingSlotId",authenticate,expressAsyncHandler(deleteBookingSlotController.deleteBookingSlot.bind(deleteBookingSlotController)))

//BOOKING ROUTES
trainerRoutes.get("/bookings",authenticate,expressAsyncHandler(getAppointmentController.getBookingRequests.bind(getAppointmentController)))
trainerRoutes.patch("/bookings",authenticate,expressAsyncHandler(updateAppointmentController.handleBookingRequest.bind(updateAppointmentController)))

//APPOINTMENT ROUTES
trainerRoutes.get("/appointments",authenticate,expressAsyncHandler(getAppointmentController.getTrainerSchedules.bind(getAppointmentController)))
trainerRoutes.patch("/appointments/:appointmentId",authenticate,expressAsyncHandler(updateAppointmentController.cancelAppointment.bind(updateAppointmentController)))
trainerRoutes.get("/video-call-logs",authenticate,expressAsyncHandler(trainerVideoCallController.getVideoCallLogsTrainer.bind(trainerVideoCallController)))

//DASHBOARD ROUTES
trainerRoutes.get("/dashboard",authenticate,expressAsyncHandler(trainerDashboardController.getTrainerDashBoardData.bind(trainerDashboardController)))

//PROFILE UPDATION ROUTES
trainerRoutes.put("/profile",authenticate,expressAsyncHandler(profileController.updateTrainerProfile.bind(profileController)))


export default trainerRoutes