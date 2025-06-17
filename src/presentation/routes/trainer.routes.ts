import express from "express";
import { authenticate } from "@presentation/middlewares/auth.middleware";
import {
  addVideoController,
  editVideoController,
  updateVideoStatusController,
  updateAppointmentController,
  subscriptionPlanController,
  trainerDashboardController,
  getTrainerVideoCallLogController,
  createBookingSlotController,
  deleteBookingSlotController,
  addPlaylistController,
  getPlaylistController,
  updatePlaylistPrivacyController,
  editPlaylistController,
  updateTrainerProfileController,
  getBookingRequestsController,
  getTrainerSchedulesController,
  cancelAppointmentController,
  getPendingSlotsController,
  getAllPlaylistController,
  getTrainerSubscriptionController,
  getTrainerSubscribersController,
  getAllVideosController,
} from "../../di/di";
import { asyncHandler } from "@shared/utils/async-handler";

const trainerRoutes = express.Router();

// SUBSCRIPTION ROUTES
trainerRoutes.post(
  "/subscriptions",
  authenticate,
  asyncHandler(
    subscriptionPlanController.addSubscription.bind(subscriptionPlanController)
  )
);
trainerRoutes.get(
  "/subscriptions",
  authenticate,
  asyncHandler(
    getTrainerSubscriptionController.handleGetTrainerSubscriptions.bind(
      getTrainerSubscriptionController
    )
  )
);
trainerRoutes.patch(
  "/subscriptions/:subscriptionId",
  authenticate,
  asyncHandler(
    subscriptionPlanController.updateSubscriptionBlockStatus.bind(
      subscriptionPlanController
    )
  )
);
trainerRoutes.put(
  "/subscriptions/:subscriptionId",
  authenticate,
  asyncHandler(
    subscriptionPlanController.editSubscription.bind(subscriptionPlanController)
  )
);
trainerRoutes.delete(
  "/subscriptions/:subscriptionId",
  authenticate,
  asyncHandler(
    subscriptionPlanController.deleteSubscription.bind(
      subscriptionPlanController
    )
  )
);
trainerRoutes.get(
  "/subscribers",
  authenticate,
  asyncHandler(
    getTrainerSubscribersController.handleGetTrainerSubscribedUsers.bind(
      getTrainerSubscribersController
    )
  )
);

//PLAYLIST MANAGEMENT ROUTES
trainerRoutes.post(
  "/playlists",
  authenticate,
  asyncHandler(
    addPlaylistController.handleAddPlaylist.bind(addPlaylistController)
  )
);
trainerRoutes.get(
  "/playlists",
  authenticate,
  asyncHandler(
    getPlaylistController.handleGetPlaylists.bind(getPlaylistController)
  )
);
trainerRoutes.get(
  "/playlists/all",
  authenticate,
  asyncHandler(
    getAllPlaylistController.handleGetallPlayLists.bind(
      getAllPlaylistController
    )
  )
);
trainerRoutes.patch(
  "/playlists/:playListId",
  authenticate,
  asyncHandler(
    updatePlaylistPrivacyController.handleUpdatePrivacy.bind(updatePlaylistPrivacyController)
  )
);
trainerRoutes.put(
  "/playlists/:playListId",
  authenticate,
  asyncHandler(
    editPlaylistController.handleEditPlayList.bind(editPlaylistController)
  )
);

//VIDEO MANAGEMENT ROUTES
trainerRoutes.post(
  "/videos/",
  authenticate,
  asyncHandler(addVideoController.handleAddVideo.bind(addVideoController))
);
trainerRoutes.patch(
  "/videos/:videoId",
  authenticate,
  asyncHandler(
    updateVideoStatusController.handleUpdatePrivacy.bind(
      updateVideoStatusController
    )
  )
);
trainerRoutes.put(
  "/videos/:videoId",
  authenticate,
  asyncHandler(editVideoController.handleEditVideo.bind(editVideoController))
);
trainerRoutes.get(
  "/videos",
  authenticate,
  asyncHandler(
    getAllVideosController.handleGetAllVideos.bind(getAllVideosController)
  )
);

//SLOT MANAGEMENT
trainerRoutes.post(
  "/slots",
  authenticate,
  asyncHandler(
    createBookingSlotController.handleAddSlot.bind(createBookingSlotController)
  )
);
trainerRoutes.get(
  "/slots",
  authenticate,
  asyncHandler(
    getPendingSlotsController.handleGetPendingSlots.bind(
      getPendingSlotsController
    )
  )
);
trainerRoutes.delete(
  "/slots/:bookingSlotId",
  authenticate,
  asyncHandler(
    deleteBookingSlotController.handleDeleteSlot.bind(
      deleteBookingSlotController
    )
  )
);

//BOOKING ROUTES
trainerRoutes.get(
  "/bookings",
  authenticate,
  asyncHandler(
    getBookingRequestsController.handleGetBookingRequests.bind(
      getBookingRequestsController
    )
  )
);
trainerRoutes.patch(
  "/bookings",
  authenticate,
  asyncHandler(
    updateAppointmentController.handleBookingRequest.bind(
      updateAppointmentController
    )
  )
);

//APPOINTMENT ROUTES
trainerRoutes.get(
  "/appointments",
  authenticate,
  asyncHandler(
    getTrainerSchedulesController.handleGetTrainerSchedules.bind(
      getTrainerSchedulesController
    )
  )
);
trainerRoutes.patch(
  "/appointments/:appointmentId",
  authenticate,
  asyncHandler(
    cancelAppointmentController.handleCancelAppointment.bind(
      cancelAppointmentController
    )
  )
);
trainerRoutes.get(
  "/video-call-logs",
  authenticate,
  asyncHandler(
    getTrainerVideoCallLogController.handleGetTrainerLogs.bind(
      getTrainerVideoCallLogController
    )
  )
);

//DASHBOARD ROUTES
trainerRoutes.get(
  "/dashboard",
  authenticate,
  asyncHandler(
    trainerDashboardController.getTrainerDashBoardData.bind(
      trainerDashboardController
    )
  )
);

//PROFILE UPDATION ROUTES
trainerRoutes.put(
  "/profile",
  authenticate,
  asyncHandler(
    updateTrainerProfileController.handleUpdateTrainerProfile.bind(
      updateTrainerProfileController
    )
  )
);

export default trainerRoutes;
