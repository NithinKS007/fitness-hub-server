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
  getTrainerVideoCallLogController, 
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
trainerRoutes.post("/videos/",authenticate,expressAsyncHandler(addVideoController.handleAddVideo.bind(addVideoController)))
trainerRoutes.patch("/videos/:videoId",authenticate,expressAsyncHandler(updateVideoStatusController.handleUpdatePrivacy.bind(updateVideoStatusController)))
trainerRoutes.put("/videos/:videoId",authenticate,expressAsyncHandler(editVideoController.handleEditVideo.bind(editVideoController)))
trainerRoutes.get("/videos",authenticate,expressAsyncHandler(getVideoController.getVideos.bind(getVideoController)))

//SLOT MANAGEMENT
trainerRoutes.post("/slots",authenticate,expressAsyncHandler(createBookingSlotController.handleAddSlot.bind(createBookingSlotController)))
trainerRoutes.get("/slots",authenticate,expressAsyncHandler(getBookingSlotController.getAvailableSlots.bind(getBookingSlotController)))
trainerRoutes.delete("/slots/:bookingSlotId",authenticate,expressAsyncHandler(deleteBookingSlotController.handleDeleteSlot.bind(deleteBookingSlotController)))

//BOOKING ROUTES
trainerRoutes.get("/bookings",authenticate,expressAsyncHandler(getAppointmentController.handleGetBookingRequests.bind(getAppointmentController)))
trainerRoutes.patch("/bookings",authenticate,expressAsyncHandler(updateAppointmentController.handleBookingRequest.bind(updateAppointmentController)))

//APPOINTMENT ROUTES
trainerRoutes.get("/appointments",authenticate,expressAsyncHandler(getAppointmentController.handleGetTrainerSchedules.bind(getAppointmentController)))
trainerRoutes.patch("/appointments/:appointmentId",authenticate,expressAsyncHandler(updateAppointmentController.handleCancelAppointment.bind(updateAppointmentController)))
trainerRoutes.get("/video-call-logs",authenticate,expressAsyncHandler(getTrainerVideoCallLogController.handleGetTrainerLogs.bind(getTrainerVideoCallLogController)))

//DASHBOARD ROUTES
trainerRoutes.get("/dashboard",authenticate,expressAsyncHandler(trainerDashboardController.getTrainerDashBoardData.bind(trainerDashboardController)))

//PROFILE UPDATION ROUTES
trainerRoutes.put("/profile",authenticate,expressAsyncHandler(profileController.updateTrainerProfile.bind(profileController)))


export default trainerRoutes