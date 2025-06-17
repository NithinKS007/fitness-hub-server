export const TYPES_APPOINTMENT_CONTROLLER = {
  BookAppointmentController: Symbol.for("BookAppointmentController"),
  CancelAppointmentController: Symbol.for("CancelAppointmentController"),
  GetBookingRequestsController: Symbol.for("GetBookingRequestsController"),
  GetTrainerSchedulesController: Symbol.for("GetTrainerSchedulesController"),
  GetUserSchedulesController: Symbol.for("GetUserSchedulesController"),
  UpdateAppointmentController: Symbol.for("UpdateAppointmentController"),
};

export const TYPES_AUTH_CONTROLLER = {
  ChangePasswordController: Symbol.for("ChangePasswordController"),
  ForgotPasswordController: Symbol.for("ForgotPasswordController"),
  PasswordResetLinkController: Symbol.for("PasswordResetLinkController"),
  GoogleAuthController: Symbol.for("GoogleAuthController"),
  OtpController: Symbol.for("OtpController"),
  RefreshAccessTokenController: Symbol.for("RefreshAccessTokenController"),
  SignInController: Symbol.for("SignInController"),
  SignOutController: Symbol.for("SignOutController"),
  SignUpTrainerController: Symbol.for("SignUpTrainerController"),
  SignUpUserController: Symbol.for("SignUpUserController"),
  UpdateTrainerProfileController: Symbol.for("UpdateTrainerProfileController"),
  UpdateUserProfileController: Symbol.for("UpdateUserProfileController"),
};

export const TYPES_BOOKING_CONTROLLER = {
  CreateBookingSlotController: Symbol.for("CreateBookingSlotController"),
  DeleteBookingSlotController: Symbol.for("DeleteBookingSlotController"),
  GetAllPendingSlotsController: Symbol.for("GetAllPendingSlotsController"),
  GetPendingSlotsController: Symbol.for("GetPendingSlotsController"),
  GetUpComingSlotsController: Symbol.for("GetUpComingSlotsController"),
};

export const TYPES_CHAT_CONTROLLER = {
  ChatController: Symbol.for("ChatController"),
};

export const TYPES_DASHBOARD_CONTROLLER = {
  AdminDashboardController: Symbol.for("AdminDashboardController"),
  TrainerDashboardController: Symbol.for("TrainerDashboardController"),
  UserDashboardController: Symbol.for("UserDashboardController"),
};

export const TYPES_PLATFORM_CONTROLLER = {
  GetPlatformEarningsController: Symbol.for("GetPlatformEarningsController"),
};

export const TYPES_PLAYLIST_CONTROLLER = {
  CreatePlaylistController: Symbol.for("CreatePlaylistController"),
  EditPlaylistController: Symbol.for("EditPlaylistController"),
  GetAllPublicPlaylistController: Symbol.for("GetAllPublicPlaylistController"),
  GetAllPlaylistController: Symbol.for("GetAllPlaylistController"),
  GetPlaylistController: Symbol.for("GetPlaylistController"),
  UpdatePlaylistPrivacyController: Symbol.for(
    "UpdatePlaylistPrivacyController"
  ),
};

export const TYPES_SUBSCRIPTION_CONTROLLER = {
  CancelSubscriptionController: Symbol.for("CancelSubscriptionController"),
  CheckSubscriptionStatusController: Symbol.for(
    "CheckSubscriptionStatusController"
  ),
  GetTrainerSubscribersController: Symbol.for(
    "GetTrainerSubscribersController"
  ),
  GetTrainerSubscriptionController: Symbol.for(
    "GetTrainerSubscriptionController"
  ),
  GetUserSubscriptionController: Symbol.for("GetUserSubscriptionController"),
  PurchaseSubscriptionController: Symbol.for("PurchaseSubscriptionController"),
  SubscriptionPlanController: Symbol.for("SubscriptionPlanController"),
  VerifySubscriptionController: Symbol.for("VerifySubscriptionController"),
  WebhookController: Symbol.for("WebhookController"),
};

export const TYPES_TRAINER_CONTROLLER = {
  GetallTrainersController: Symbol.for("GetallTrainersController"),
  GetApprovedTrainersController: Symbol.for("GetApprovedTrainersController"),
  GetTrainerDetailsController: Symbol.for("GetTrainerDetailsController"),
  GetTrainerWithSubController: Symbol.for("GetTrainerWithSubController"),
  GetUserMyTrainersController: Symbol.for("GetUserMyTrainersController"),
  GetVerifyTrainerController: Symbol.for("GetVerifyTrainerController"),
  VerifyTrainerController: Symbol.for("VerifyTrainerController"),
};

export const TYPES_USER_CONTROLLER = {
  GetUserDetailsController: Symbol.for("GetUserDetailsController"),
  GetUsersController: Symbol.for("GetUsersController"),
  UpdateUserBlockStatusController: Symbol.for(
    "UpdateUserBlockStatusController"
  ),
};

export const TYPES_VIDEO_CONTROLLER = {
  AddVideoController: Symbol.for("AddVideoController"),
  EditVideoController: Symbol.for("EditVideoController"),
  GetAllVideosController: Symbol.for("GetAllVideosController"),
  GetPublicVideosController: Symbol.for("GetPublicVideosController"),
  GetPublicVideoDetailsController: Symbol.for(
    "GetPublicVideoDetailsController"
  ),
  GetVideoDetailsController: Symbol.for("GetVideoDetailsController"),
  UpdateVideoStatusController: Symbol.for("UpdateVideoStatusController"),
};

export const TYPES_VIDEOCALLLOG_CONTROLLER = {
  GetTrainerVideoCallLogController: Symbol.for(
    "GetTrainerVideoCallLogController"
  ),
  GetUserVideoCallLogController: Symbol.for("GetUserVideoCallLogController"),
};

export const TYPES_WORKOUT_CONTROLLER = {
  AddWorkoutController: Symbol.for("AddWorkoutController"),
  DeleteWorkoutController: Symbol.for("DeleteWorkoutController"),
  GetWorkoutController: Symbol.for("GetWorkoutController"),
  UpdateWorkoutController: Symbol.for("UpdateWorkoutController"),
};
