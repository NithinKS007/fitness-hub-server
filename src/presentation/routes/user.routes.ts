import express from "express";
import { authenticate } from "@presentation/middlewares/auth.middleware";
// import {
//   bookAppointmentController,
//   purchaseSubscriptionController,
//   userDashBoardController,
//   getUserVideoCallLogController,
//   getUserMyTrainersController,
//   getTrainerWithSubController,
//   getApprovedTrainersController,
//   addWorkoutController,
//   getWorkoutController,
//   deleteWorkoutController,
//   updateWorkoutController,
//   updateUserProfileController,
//   getUserSchedulesController,
//   cancelAppointmentController,
//   getAllPendingSlotsController,
//   getUpComingSlotsController,
//   getAllPlaylistController,
//   verifySubscriptionController,
//   cancelSubscriptionController,
//   checkSubscriptionStatusController,
//   getUserSubscriptionController,
//   getPublicVideosController,
//   getPublicVideoDetailscontroller,
//   getAllPublicPlaylistController,
// } from "../../di/di";
import { asyncHandler } from "@shared/utils/async-handler";
import {
  addWorkoutController,
  bookAppointmentController,
  cancelAppointmentController,
  cancelSubscriptionController,
  checkSubscriptionStatusController,
  deleteWorkoutController,
  getAllPendingSlotsController,
  getAllPublicPlaylistController,
  getApprovedTrainersController,
  getPublicVideoDetailsController,
  getPublicVideosController,
  getTrainerWithSubController,
  getUpComingSlotsController,
  getUserMyTrainersController,
  getUserSchedulesController,
  getUserSubscriptionController,
  getUserVideoCallLogController,
  getWorkoutController,
  purchaseSubscriptionController,
  updateUserProfileController,
  updateWorkoutController,
  userDashboardController,
  verifySubscriptionController,
} from "di/container-resolver";

const userRoutes = express.Router();

//TRAINER DISPLAYING ROUTES
userRoutes.get(
  "/trainers",
  asyncHandler(
    getApprovedTrainersController.handleGetApprovedTrainers.bind(
      getApprovedTrainersController
    )
  )
);
userRoutes.get(
  "/trainers/:trainerId",
  asyncHandler(
    getTrainerWithSubController.handleGetTrainerWithSub.bind(
      getTrainerWithSubController
    )
  )
);
userRoutes.get(
  "/my-trainers",
  authenticate,
  asyncHandler(
    getUserMyTrainersController.handleGetMyTrainers.bind(
      getUserMyTrainersController
    )
  )
);

//SUBSCRIPTION ROUTES
userRoutes.post(
  "/subscriptions/checkout",
  authenticate,
  asyncHandler(
    purchaseSubscriptionController.handlePurchase.bind(
      purchaseSubscriptionController
    )
  )
);
userRoutes.get(
  "/subscriptions",
  authenticate,
  asyncHandler(
    getUserSubscriptionController.handleGetUserSub.bind(
      getUserSubscriptionController
    )
  )
);
userRoutes.get(
  "/subscriptions/:sessionId/verify",
  authenticate,
  asyncHandler(
    verifySubscriptionController.handleVerifySubscription.bind(
      verifySubscriptionController
    )
  )
);
userRoutes.patch(
  "/subscriptions/cancel",
  authenticate,
  asyncHandler(
    cancelSubscriptionController.handleCancelSubscription.bind(
      cancelSubscriptionController
    )
  )
);
userRoutes.get(
  "/subscriptions/:trainerId/status/",
  authenticate,
  asyncHandler(
    checkSubscriptionStatusController.handleCheckSubStatus.bind(
      checkSubscriptionStatusController
    )
  )
);

//VIDEO ROUTES
userRoutes.get(
  "/trainers/:trainerId/videos",
  authenticate,
  asyncHandler(
    getPublicVideosController.handleGetPublicVideos.bind(
      getPublicVideosController
    )
  )
);
userRoutes.get(
  "/videos/:videoId",
  authenticate,
  asyncHandler(
    getPublicVideoDetailsController.handleGetPublicVideoById.bind(
      getPublicVideoDetailsController
    )
  )
);

//PLAYLIST ROUTES
userRoutes.get(
  "/playlists/:trainerId",
  authenticate,
  asyncHandler(
    getAllPublicPlaylistController.handleGetallPublicPlayLists.bind(
      getAllPublicPlaylistController
    )
  )
);

//BOOKING ROUTES
userRoutes.get(
  "/slots/:trainerId/available",
  authenticate,
  asyncHandler(
    getAllPendingSlotsController.handleGetAllAvailableSlots.bind(
      getAllPendingSlotsController
    )
  )
);
userRoutes.get(
  "/slots/:trainerId/upcoming",
  authenticate,
  asyncHandler(
    getUpComingSlotsController.handleGetUpcomingSlots.bind(
      getUpComingSlotsController
    )
  )
);
userRoutes.post(
  "/slots/:slotId",
  authenticate,
  asyncHandler(
    bookAppointmentController.handleBookAppointment.bind(
      bookAppointmentController
    )
  )
);

//APPOINTMENT ROUTES
userRoutes.get(
  "/appointments",
  authenticate,
  asyncHandler(
    getUserSchedulesController.handleGetUserSchedules.bind(
      getUserSchedulesController
    )
  )
);
userRoutes.patch(
  "/appointments/:appointmentId",
  authenticate,
  asyncHandler(
    cancelAppointmentController.handleCancelAppointment.bind(
      cancelAppointmentController
    )
  )
);
userRoutes.get(
  "/video-call-logs",
  authenticate,
  asyncHandler(
    getUserVideoCallLogController.handleGetUserLogs.bind(
      getUserVideoCallLogController
    )
  )
);

//PROFILE ROUTES
userRoutes.put(
  "/profile",
  authenticate,
  asyncHandler(
    updateUserProfileController.handleUpdateUserProfile.bind(
      updateUserProfileController
    )
  )
);

//WORKOUT ROUTES
userRoutes.post(
  "/workouts",
  authenticate,
  asyncHandler(addWorkoutController.handleAddWorkout.bind(addWorkoutController))
);
userRoutes.get(
  "/workouts",
  authenticate,
  asyncHandler(getWorkoutController.handleGetWorkout.bind(getWorkoutController))
);
userRoutes.delete(
  "/workouts/:setId",
  authenticate,
  asyncHandler(
    deleteWorkoutController.handleDeleteWorkout.bind(deleteWorkoutController)
  )
);
userRoutes.patch(
  "/workouts/:setId",
  authenticate,
  asyncHandler(
    updateWorkoutController.handlWorkoutComplete.bind(updateWorkoutController)
  )
);

//DASHBOARD ROUTES
userRoutes.get(
  "/dashBoard",
  authenticate,
  asyncHandler(
    userDashboardController.getUserDashBoardData.bind(userDashboardController)
  )
);

export default userRoutes;
