import { container } from './container'; 

import {
  AddVideoController,
  AddWorkoutController,
  AdminDashboardController,
  BookAppointmentController,
  CancelAppointmentController,
  CancelSubscriptionController,
  ChangePasswordController,
  CheckSubscriptionStatusController,
  CheckUserBlockStatusUseCase,
  CreateBookingSlotController,
  CreateMessageUseCase,
  CreatePlaylistController,
  CreateVideoCallLogUseCase,
  DateService,
  DeleteBookingSlotController,
  DeleteWorkoutController,
  EditPlaylistController,
  EditVideoController,
  ForgotPasswordController,
  GetAllPendingSlotsController,
  GetAllPlaylistController,
  GetAllPublicPlaylistController,
  GetallTrainersController,
  GetAllVideosController,
  GetAppointmentByIdUseCase,
  GetApprovedTrainersController,
  GetBookingRequestsController,
  GetChatsController,
  GetPendingSlotsController,
  GetPlatformEarningsController,
  GetPlaylistController,
  GetPublicVideoDetailsController,
  GetPublicVideosController,
  GetTrainerDetailsController,
  GetTrainerDetailsUseCase,
  GetTrainerSchedulesController,
  GetTrainerSubscribersController,
  GetTrainerSubscriptionController,
  GetTrainerVideoCallLogController,
  GetTrainerWithSubController,
  GetUpComingSlotsController,
  GetUserDetailsController,
  GetUserMyTrainersController,
  GetUserSchedulesController,
  GetUsersController,
  GetUserSubscriptionController,
  GetUserVideoCallLogController,
  GetVerifyTrainerController,
  GetVideoDetailsController,
  GetWorkoutController,
  GoogleAuthController,
  IncrementUnReadMessageCountUseCase,
  LoggerUseCase,
  MarkMessageAsReadUseCase,
  OtpController,
  PasswordResetLinkController,
  PurchaseSubscriptionController,
  RefreshAccessTokenController,
  SignInController,
  SignOutController,
  SignUpTrainerController,
  SignUpUserController,
  SubscriptionPlanController,
  TokenUseCase,
  TrainerDashboardController,
  UpdateAppointmentController,
  UpdateLastMessageUseCase,
  UpdatePlaylistPrivacyController,
  UpdateTrainerProfileController,
  UpdateUnReadMessageCountUseCase,
  UpdateUserBlockStatusController,
  UpdateUserProfileController,
  UpdateVideoCallDurationUseCase,
  UpdateVideoCallStatusUseCase,
  UpdateVideoStatusController,
  UpdateWorkoutController,
  UserDashboardController,
  VerifySubscriptionController,
  VerifyTrainerController,
  WebhookController,
} from "./file-imports-index";

import {
  TYPES_APPOINTMENT_CONTROLLER,
  TYPES_AUTH_CONTROLLER,
  TYPES_BOOKING_CONTROLLER,
  TYPES_CHAT_CONTROLLER,
  TYPES_DASHBOARD_CONTROLLER,
  TYPES_PLATFORM_CONTROLLER,
  TYPES_PLAYLIST_CONTROLLER,
  TYPES_SUBSCRIPTION_CONTROLLER,
  TYPES_TRAINER_CONTROLLER,
  TYPES_USER_CONTROLLER,
  TYPES_VIDEO_CONTROLLER,
  TYPES_VIDEOCALLLOG_CONTROLLER,
  TYPES_WORKOUT_CONTROLLER,
} from "./types-controllers";
import { TYPES_SERVICES } from './types-services';

import {
  TYPES_APPOINTMENT_USECASES,
  TYPES_AUTH_USECASES,
  TYPES_CHAT_USECASES,
  TYPES_LOGGER_USECASES,
  TYPES_TRAINER_USECASES,
  TYPES_VIDEO_CALL_LOG_USECASES,
} from "./types-usecases";

// Appointment Controllers
export const bookAppointmentController = container.get<BookAppointmentController>(TYPES_APPOINTMENT_CONTROLLER.BookAppointmentController);
export const cancelAppointmentController = container.get<CancelAppointmentController>(TYPES_APPOINTMENT_CONTROLLER.CancelAppointmentController);
export const getBookingRequestsController = container.get<GetBookingRequestsController>(TYPES_APPOINTMENT_CONTROLLER.GetBookingRequestsController);
export const getTrainerSchedulesController = container.get<GetTrainerSchedulesController>(TYPES_APPOINTMENT_CONTROLLER.GetTrainerSchedulesController);
export const getUserSchedulesController = container.get<GetUserSchedulesController>(TYPES_APPOINTMENT_CONTROLLER.GetUserSchedulesController);
export const updateAppointmentController = container.get<UpdateAppointmentController>(TYPES_APPOINTMENT_CONTROLLER.UpdateAppointmentController);

// Auth Controllers
export const changePasswordController = container.get<ChangePasswordController>(TYPES_AUTH_CONTROLLER.ChangePasswordController);
export const forgotPasswordController = container.get<ForgotPasswordController>(TYPES_AUTH_CONTROLLER.ForgotPasswordController);
export const passwordResetLinkController = container.get<PasswordResetLinkController>(TYPES_AUTH_CONTROLLER.PasswordResetLinkController);
export const googleAuthController = container.get<GoogleAuthController>(TYPES_AUTH_CONTROLLER.GoogleAuthController);
export const otpController = container.get<OtpController>(TYPES_AUTH_CONTROLLER.OtpController);
export const refreshAccessTokenController = container.get<RefreshAccessTokenController>(TYPES_AUTH_CONTROLLER.RefreshAccessTokenController);
export const signInController = container.get<SignInController>(TYPES_AUTH_CONTROLLER.SignInController);
export const signOutController = container.get<SignOutController>(TYPES_AUTH_CONTROLLER.SignOutController);
export const signUpTrainerController = container.get<SignUpTrainerController>(TYPES_AUTH_CONTROLLER.SignUpTrainerController);
export const signUpUserController = container.get<SignUpUserController>(TYPES_AUTH_CONTROLLER.SignUpUserController);
export const updateTrainerProfileController = container.get<UpdateTrainerProfileController>(TYPES_AUTH_CONTROLLER.UpdateTrainerProfileController);
export const updateUserProfileController = container.get<UpdateUserProfileController>(TYPES_AUTH_CONTROLLER.UpdateUserProfileController);

// Booking Controllers
export const createBookingSlotController = container.get<CreateBookingSlotController>(TYPES_BOOKING_CONTROLLER.CreateBookingSlotController);
export const deleteBookingSlotController = container.get<DeleteBookingSlotController>(TYPES_BOOKING_CONTROLLER.DeleteBookingSlotController);
export const getAllPendingSlotsController = container.get<GetAllPendingSlotsController>(TYPES_BOOKING_CONTROLLER.GetAllPendingSlotsController);
export const getPendingSlotsController = container.get<GetPendingSlotsController>(TYPES_BOOKING_CONTROLLER.GetPendingSlotsController);
export const getUpComingSlotsController = container.get<GetUpComingSlotsController>(TYPES_BOOKING_CONTROLLER.GetUpComingSlotsController);

// Chat Controllers
export const getChatsController = container.get<GetChatsController>(TYPES_CHAT_CONTROLLER.GetChatsController);
export const getUserContactsController = container.get<GetChatsController>(TYPES_CHAT_CONTROLLER.GetUserContactsController);
export const getTrainerContactsController = container.get<GetChatsController>(TYPES_CHAT_CONTROLLER.GetTrainerContactsController);

// Dashboard Controllers
export const adminDashboardController = container.get<AdminDashboardController>(TYPES_DASHBOARD_CONTROLLER.AdminDashboardController);
export const trainerDashboardController = container.get<TrainerDashboardController>(TYPES_DASHBOARD_CONTROLLER.TrainerDashboardController);
export const userDashboardController = container.get<UserDashboardController>(TYPES_DASHBOARD_CONTROLLER.UserDashboardController);

// Platform Controllers
export const getPlatformEarningsController = container.get<GetPlatformEarningsController>(TYPES_PLATFORM_CONTROLLER.GetPlatformEarningsController);

// Playlist Controllers
export const createPlaylistController = container.get<CreatePlaylistController>(TYPES_PLAYLIST_CONTROLLER.CreatePlaylistController);
export const editPlaylistController = container.get<EditPlaylistController>(TYPES_PLAYLIST_CONTROLLER.EditPlaylistController);
export const getAllPublicPlaylistController = container.get<GetAllPublicPlaylistController>(TYPES_PLAYLIST_CONTROLLER.GetAllPublicPlaylistController);
export const getAllPlaylistController = container.get<GetAllPlaylistController>(TYPES_PLAYLIST_CONTROLLER.GetAllPlaylistController);
export const getPlaylistController = container.get<GetPlaylistController>(TYPES_PLAYLIST_CONTROLLER.GetPlaylistController);
export const updatePlaylistPrivacyController = container.get<UpdatePlaylistPrivacyController>(TYPES_PLAYLIST_CONTROLLER.UpdatePlaylistPrivacyController);;

// Subscription Controllers
export const cancelSubscriptionController = container.get<CancelSubscriptionController>(TYPES_SUBSCRIPTION_CONTROLLER.CancelSubscriptionController);
export const checkSubscriptionStatusController = container.get<CheckSubscriptionStatusController>(TYPES_SUBSCRIPTION_CONTROLLER.CheckSubscriptionStatusController);
export const getTrainerSubscribersController = container.get<GetTrainerSubscribersController>(TYPES_SUBSCRIPTION_CONTROLLER.GetTrainerSubscribersController);
export const getTrainerSubscriptionController = container.get<GetTrainerSubscriptionController>(TYPES_SUBSCRIPTION_CONTROLLER.GetTrainerSubscriptionController);
export const getUserSubscriptionController = container.get<GetUserSubscriptionController>(TYPES_SUBSCRIPTION_CONTROLLER.GetUserSubscriptionController);
export const purchaseSubscriptionController = container.get<PurchaseSubscriptionController>(TYPES_SUBSCRIPTION_CONTROLLER.PurchaseSubscriptionController);
export const subscriptionPlanController = container.get<SubscriptionPlanController>(TYPES_SUBSCRIPTION_CONTROLLER.SubscriptionPlanController);
export const verifySubscriptionController = container.get<VerifySubscriptionController>(TYPES_SUBSCRIPTION_CONTROLLER.VerifySubscriptionController);
export const webhookController = container.get<WebhookController>(TYPES_SUBSCRIPTION_CONTROLLER.WebhookController);

// Trainer Controllers
export const getAllTrainersController = container.get<GetallTrainersController>(TYPES_TRAINER_CONTROLLER.GetallTrainersController);
export const getApprovedTrainersController = container.get<GetApprovedTrainersController>(TYPES_TRAINER_CONTROLLER.GetApprovedTrainersController);
export const getTrainerDetailsController = container.get<GetTrainerDetailsController>(TYPES_TRAINER_CONTROLLER.GetTrainerDetailsController);
export const getTrainerWithSubController = container.get<GetTrainerWithSubController>(TYPES_TRAINER_CONTROLLER.GetTrainerWithSubController);
export const getUserMyTrainersController = container.get<GetUserMyTrainersController>(TYPES_TRAINER_CONTROLLER.GetUserMyTrainersController);
export const getVerifyTrainerController = container.get<GetVerifyTrainerController>(TYPES_TRAINER_CONTROLLER.GetVerifyTrainerController);
export const verifyTrainerController = container.get<VerifyTrainerController>(TYPES_TRAINER_CONTROLLER.VerifyTrainerController);

// User Controllers
export const getUserDetailsController = container.get<GetUserDetailsController>(TYPES_USER_CONTROLLER.GetUserDetailsController);
export const getUsersController = container.get<GetUsersController>(TYPES_USER_CONTROLLER.GetUsersController);
export const updateUserBlockStatusController = container.get<UpdateUserBlockStatusController>(TYPES_USER_CONTROLLER.UpdateUserBlockStatusController);

// Video Controllers
export const addVideoController = container.get<AddVideoController>(TYPES_VIDEO_CONTROLLER.AddVideoController);
export const editVideoController = container.get<EditVideoController>(TYPES_VIDEO_CONTROLLER.EditVideoController);
export const getAllVideosController = container.get<GetAllVideosController>(TYPES_VIDEO_CONTROLLER.GetAllVideosController);
export const getPublicVideosController = container.get<GetPublicVideosController>(TYPES_VIDEO_CONTROLLER.GetPublicVideosController);
export const getPublicVideoDetailsController = container.get<GetPublicVideoDetailsController>(TYPES_VIDEO_CONTROLLER.GetPublicVideoDetailsController);
export const getVideoDetailsController = container.get<GetVideoDetailsController>(TYPES_VIDEO_CONTROLLER.GetVideoDetailsController);
export const updateVideoStatusController = container.get<UpdateVideoStatusController>(TYPES_VIDEO_CONTROLLER.UpdateVideoStatusController);

// Video Call Log Controllers
export const getTrainerVideoCallLogController = container.get<GetTrainerVideoCallLogController>(TYPES_VIDEOCALLLOG_CONTROLLER.GetTrainerVideoCallLogController);
export const getUserVideoCallLogController = container.get<GetUserVideoCallLogController>(TYPES_VIDEOCALLLOG_CONTROLLER.GetUserVideoCallLogController);

// Workout Controllers
export const addWorkoutController = container.get<AddWorkoutController>(TYPES_WORKOUT_CONTROLLER.AddWorkoutController);
export const deleteWorkoutController = container.get<DeleteWorkoutController>(TYPES_WORKOUT_CONTROLLER.DeleteWorkoutController);
export const getWorkoutController = container.get<GetWorkoutController>(TYPES_WORKOUT_CONTROLLER.GetWorkoutController);
export const updateWorkoutController = container.get<UpdateWorkoutController>(TYPES_WORKOUT_CONTROLLER.UpdateWorkoutController);

// Use Cases
export const getTrainerDetailsUseCase = container.get<GetTrainerDetailsUseCase>(TYPES_TRAINER_USECASES.GetTrainerDetailsUseCase);
export const createMessageUseCase = container.get<CreateMessageUseCase>(TYPES_CHAT_USECASES.CreateMessageUseCase);
export const markMessageAsReadUseCase = container.get<MarkMessageAsReadUseCase>(TYPES_CHAT_USECASES.MarkMessageAsReadUseCase);
export const updateUnReadMessageCount = container.get<UpdateUnReadMessageCountUseCase>(TYPES_CHAT_USECASES.UpdateUnReadMessageCountUseCase1);
export const incUnReadCountUseCase = container.get<IncrementUnReadMessageCountUseCase>(TYPES_CHAT_USECASES.IncrementUnReadMessageCountUseCase);
export const updateLastMessageUseCase = container.get<UpdateLastMessageUseCase>(TYPES_CHAT_USECASES.UpdateLastMessageUseCase);
export const createVideoCallLogUseCase = container.get<CreateVideoCallLogUseCase>(TYPES_VIDEO_CALL_LOG_USECASES.CreateVideoCallLogUseCase);
export const updateVideoCallDurationUseCase = container.get<UpdateVideoCallDurationUseCase>(TYPES_VIDEO_CALL_LOG_USECASES.UpdateVideoCallDurationUseCase);
export const updateVideoCallStatusUseCase = container.get<UpdateVideoCallStatusUseCase>(TYPES_VIDEO_CALL_LOG_USECASES.UpdateVideoCallStatusUseCase);
export const getAppointmentByIdUseCase = container.get<GetAppointmentByIdUseCase>(TYPES_APPOINTMENT_USECASES.GetAppointmentByIdUseCase);
export const tokenUseCase = container.get<TokenUseCase>(TYPES_AUTH_USECASES.TokenUseCase)
export const checkBlockStatusUseCase = container.get<CheckUserBlockStatusUseCase>(TYPES_AUTH_USECASES.CheckUserBlockStatusUseCase)
export const loggerUseCase = container.get<LoggerUseCase>(TYPES_LOGGER_USECASES.LoggerUseCase);

// Services
export const dateService = container.get<DateService>(TYPES_SERVICES.DateService)



