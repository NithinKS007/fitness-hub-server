import { Container } from "inversify";
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

import {
  TYPES_APPOINTMENT_USECASES,
  TYPES_AUTH_USECASES,
  TYPES_BOOKINGSLOT_USECASAES,
  TYPES_CHAT_USECASES,
  TYPES_DASHBOARD_USECASES,
  TYPES_PLATFORM_USECASES,
  TYPES_PLAYLIST_USECASES,
  TYPES_SUBSCRIPTION_USECASES,
  TYPES_TRAINER_USECASES,
  TYPES_USER_USECASES,
  TYPES_VIDEO_USECASES,
  TYPES_VIDEO_CALL_LOG_USECASES,
  TYPES_WORKOUT_USECASES,
  TYPES_LOGGER_USECASES,
} from "./types-usecases";
import { TYPES_SERVICES } from "./types-services";
import { TYPES_REPOSITORIES } from "./types-repositories";

import {
  UserRepository,
  TrainerRepository,
  SubscriptionRepository,
  UserSubscriptionPlanRepository,
  RevenueRepository,
  PasswordResetRepository,
  OtpRepository,
  ChatRepository,
  ConversationRepository,
  PlayListRepository,
  VideoRepository,
  VideoPlayListRepository,
  WorkoutRepository,
  BookingSlotRepository,
  AppointmentRepository,
  VideoCallLogRepository,
  BookAppointmentController,
  GetBookingRequestsController,
  GetUserSchedulesController,
  UpdateAppointmentController,
  GoogleAuthController,
  OtpController,
  CreateBookingSlotController,
  DeleteBookingSlotController,
  TrainerDashboardController,
  UserDashboardController,
  GetPlatformEarningsController,
  GetAllPublicPlaylistController,
  GetallTrainersController,
  GetTrainerDetailsController,
  GetTrainerWithSubController,
  GetUserMyTrainersController,
  GetVerifyTrainerController,
  VerifyTrainerController,
  GetUserDetailsController,
  GetUsersController,
  UpdateUserBlockStatusController,
  AddVideoController,
  EditVideoController,
  UpdateVideoStatusController,
  GetTrainerVideoCallLogController,
  GetUserVideoCallLogController,
  AddWorkoutController,
  DeleteWorkoutController,
  GetWorkoutController,
  UpdateWorkoutController,
  IUserRepository,
  ITrainerRepository,
  ISubscriptionRepository,
  IUserSubscriptionPlanRepository,
  IPlatformEarningsRepository,
  IPasswordResetRepository,
  IOtpRepository,
  IChatRepository,
  IConversationRepository,
  IPlayListRepository,
  IVideoRepository,
  IVideoPlayListRepository,
  IWorkoutRepository,
  IBookingSlotRepository,
  IAppointmentRepository,
  IVideoCallLogRepository,
  IPaymentService,
  IAuthService,
  ICloudStorageService,
  IGoogleAuthService,
  IEmailService,
  IOTPService,
  IEncryptionService,
  IHashService,
  IDateService,
  ILoggerService,
  LoggerService,
  LoggerUseCase,
  GetChatsController,
  GetTrainerContactsController,
  GetUserContactsController,
  // ErrorMiddleware,
  // AuthMiddleware,
} from "./file-imports-index";

// Services
import {
  StripePaymentService,
  JwtService,
  CloudinaryService,
  GoogleAuthService,
  EmailService,
  OTPService,
  EncryptionService,
  HashService,
  DateService,
} from "./file-imports-index";

// Use Cases
import {
  GetPlatformEarningsUsecase,
  GetTrainerSubscriptionsUseCase,
  TrainerApprovalUseCase,
  AdminDashBoardUseCase,
  CreateUserUseCase,
  SigninUserUseCase,
  OtpUseCase,
  GoogleAuthUseCase,
  CreateTrainerUseCase,
  UpdateTrainerProfileUseCase,
  TokenUseCase,
  CreateSubscriptionUseCase,
  EditSubscriptionUseCase,
  DeleteSubscriptionUseCase,
  SubscriptionBlockUseCase,
  CheckSubscriptionStatusUseCase,
  WebHookHandlerUseCase,
  CreateVideoUseCase,
  EditVideoUseCase,
  UpdateVideoPrivacyUseCase,
  GetVideosUseCase,
  CreateWorkoutUseCase,
  GetWorkoutUseCase,
  BookAppointmentUseCase,
  GetTrainerVideoCallLogUseCase,
  GetUserVideoCallLogUseCase,
  GetTrainerSubscribersUseCase,
  DeleteWorkoutUseCase,
  CompleteWorkoutUseCase,
  GetChatHistoryUseCase,
  GetTrainerChatListUseCase,
  GetUserChatListUseCase,
  GetUsersUseCase,
  GetUserDetailsUseCase,
  UpdateUserBlockStatusUseCase,
  GetTrainerDetailsUseCase,
  GetTrainerAndSubInfoUseCase,
  GetTrainersUseCase,
  GetUserTrainerslistUseCase,
  VerifySubcriptionSessionUseCase,
  ChangePasswordUseCase,
  ForgotPasswordUseCase,
  GetPendingSlotsUseCase,
  GetVideoDetailsUseCase,
  GetUserSchedulesUseCase,
  GetUpComingSlotsUseCase,
  GetAllPendingSlotsUseCase,
  GetUserSubscriptionUseCase,
  GetTrainerSchedulesUseCase,
  SendPasswordRestLinkUseCase,
  UserDashBoardUseCase,
  GetPlayListUseCase,
  EditPlayListUseCase,
  CreateMessageUseCase,
  CreatePlayListUseCase,
  GetallPlaylistUseCase,
  TrainerDashBoardUseCase,
  UpdateUserProfileUseCase,
  UpdateLastMessageUseCase,
  CancelAppointmentUseCase,
  CreateBookingSlotUseCase,
  DeleteBookingSlotUseCase,
  MarkMessageAsReadUseCase,
  CancelSubscriptionUseCase,
  CreateVideoCallLogUseCase,
  GetAppointmentByIdUseCase,
  GetApprovedTrainersUseCase,
  CheckUserBlockStatusUseCase,
  PurchaseSubscriptionUseCase,
  GetVerifyTrainerlistUseCase,
  UpdateVideoCallStatusUseCase,
  UpdatePlayListPrivacyUseCase,
  GetAppointmentRequestUseCase,
  HandleBookingApprovalUseCase,
  UpdateVideoCallDurationUseCase,
  UpdateUnReadMessageCountUseCase,
  IncrementUnReadMessageCountUseCase,
} from "./file-imports-index";

// Controllers
import {
  AdminDashboardController,
  GetApprovedTrainersController,
  PurchaseSubscriptionController,
  GetUserSubscriptionController,
  WebhookController,
  SubscriptionPlanController,
  GetTrainerSubscribersController,
  GetTrainerSubscriptionController,
  VerifySubscriptionController,
  CancelSubscriptionController,
  CheckSubscriptionStatusController,
  SignUpTrainerController,
  SignUpUserController,
  UpdateTrainerProfileController,
  SignInController,
  RefreshAccessTokenController,
  SignOutController,
  GetAllVideosController,
  GetPublicVideosController,
  GetVideoDetailsController,
  GetPublicVideoDetailsController,
  ChangePasswordController,
  ForgotPasswordController,
  PasswordResetLinkController,
  UpdateUserProfileController,
  GetTrainerSchedulesController,
  CancelAppointmentController,
  GetPendingSlotsController,
  GetAllPendingSlotsController,
  GetUpComingSlotsController,
  GetAllPlaylistController,
  CreatePlaylistController,
  EditPlaylistController,
  GetPlaylistController,
  UpdatePlaylistPrivacyController,
} from "./file-imports-index";


const container = new Container();

// Bind Repositories
container.bind<IUserRepository>(TYPES_REPOSITORIES.UserRepository).to(UserRepository);
container.bind<ITrainerRepository>(TYPES_REPOSITORIES.TrainerRepository).to(TrainerRepository);
container.bind<ISubscriptionRepository>(TYPES_REPOSITORIES.SubscriptionRepository).to(SubscriptionRepository);
container.bind<IUserSubscriptionPlanRepository>(TYPES_REPOSITORIES.UserSubscriptionPlanRepository).to(UserSubscriptionPlanRepository);
container.bind<IPlatformEarningsRepository>(TYPES_REPOSITORIES.RevenueRepository).to(RevenueRepository);
container.bind<IPasswordResetRepository>(TYPES_REPOSITORIES.PasswordResetRepository).to(PasswordResetRepository);
container.bind<IOtpRepository>(TYPES_REPOSITORIES.OtpRepository).to(OtpRepository);
container.bind<IChatRepository>(TYPES_REPOSITORIES.ChatRepository).to(ChatRepository);
container.bind<IConversationRepository>(TYPES_REPOSITORIES.ConversationRepository).to(ConversationRepository);
container.bind<IPlayListRepository>(TYPES_REPOSITORIES.PlayListRepository).to(PlayListRepository);
container.bind<IVideoRepository>(TYPES_REPOSITORIES.VideoRepository).to(VideoRepository);
container.bind<IVideoPlayListRepository>(TYPES_REPOSITORIES.VideoPlayListRepository).to(VideoPlayListRepository);
container.bind<IWorkoutRepository>(TYPES_REPOSITORIES.WorkoutRepository).to(WorkoutRepository);
container.bind<IBookingSlotRepository>(TYPES_REPOSITORIES.BookingSlotRepository).to(BookingSlotRepository);
container.bind<IAppointmentRepository>(TYPES_REPOSITORIES.AppointmentRepository).to(AppointmentRepository);
container.bind<IVideoCallLogRepository>(TYPES_REPOSITORIES.VideoCallLogRepository).to(VideoCallLogRepository);

// Bind Services
container.bind<IPaymentService>(TYPES_SERVICES.PaymentService).to(StripePaymentService);
container.bind<IAuthService>(TYPES_SERVICES.AuthService).to(JwtService);
container.bind<ICloudStorageService>(TYPES_SERVICES.CloudStorageService).to(CloudinaryService);
container.bind<IGoogleAuthService>(TYPES_SERVICES.GoogleAuthService).to(GoogleAuthService);
container.bind<IEmailService>(TYPES_SERVICES.EmailService).to(EmailService);
container.bind<IOTPService>(TYPES_SERVICES.OTPService).to(OTPService);
container.bind<IEncryptionService>(TYPES_SERVICES.EncryptionService).to(EncryptionService);
container.bind<IHashService>(TYPES_SERVICES.HashService).to(HashService);
container.bind<IDateService>(TYPES_SERVICES.DateService).to(DateService);
container.bind<ILoggerService>(TYPES_SERVICES.LoggerService).to(LoggerService)

// Bind Appointment Use Cases
container.bind(TYPES_APPOINTMENT_USECASES.BookAppointmentUseCase).to(BookAppointmentUseCase);
container.bind(TYPES_APPOINTMENT_USECASES.CancelAppointmentUseCase).to(CancelAppointmentUseCase);
container.bind(TYPES_APPOINTMENT_USECASES.GetAppointmentRequestUseCase).to(GetAppointmentRequestUseCase);
container.bind(TYPES_APPOINTMENT_USECASES.GetAppointmentByIdUseCase).to(GetAppointmentByIdUseCase);
container.bind(TYPES_APPOINTMENT_USECASES.GetTrainerSchedulesUseCase).to(GetTrainerSchedulesUseCase);
container.bind(TYPES_APPOINTMENT_USECASES.GetUserSchedulesUseCase).to(GetUserSchedulesUseCase);
container.bind(TYPES_APPOINTMENT_USECASES.HandleBookingApprovalUseCase).to(HandleBookingApprovalUseCase);

// Bind Auth Use Cases
container.bind(TYPES_AUTH_USECASES.ChangePasswordUseCase).to(ChangePasswordUseCase);
container.bind(TYPES_AUTH_USECASES.CheckUserBlockStatusUseCase).to(CheckUserBlockStatusUseCase);
container.bind(TYPES_AUTH_USECASES.CreateTrainerUseCase).to(CreateTrainerUseCase);
container.bind(TYPES_AUTH_USECASES.CreateUserUseCase).to(CreateUserUseCase);
container.bind(TYPES_AUTH_USECASES.ForgotPasswordUseCase).to(ForgotPasswordUseCase);
container.bind(TYPES_AUTH_USECASES.GoogleAuthUseCase).to(GoogleAuthUseCase);
container.bind(TYPES_AUTH_USECASES.OtpUseCase).to(OtpUseCase);
container.bind(TYPES_AUTH_USECASES.SendPasswordRestLinkUseCase).to(SendPasswordRestLinkUseCase);
container.bind(TYPES_AUTH_USECASES.SigninUserUseCase).to(SigninUserUseCase);
container.bind(TYPES_AUTH_USECASES.TokenUseCase).to(TokenUseCase);
container.bind(TYPES_AUTH_USECASES.UpdateTrainerProfileUseCase).to(UpdateTrainerProfileUseCase);
container.bind(TYPES_AUTH_USECASES.UpdateUserProfileUseCase).to(UpdateUserProfileUseCase);

//Bind Booking Slot Use Cases
container.bind(TYPES_BOOKINGSLOT_USECASAES.CreateBookingSlotUseCase).to(CreateBookingSlotUseCase);
container.bind(TYPES_BOOKINGSLOT_USECASAES.DeleteBookingSlotUseCase).to(DeleteBookingSlotUseCase);
container.bind(TYPES_BOOKINGSLOT_USECASAES.GetAllPendingSlotsUseCase).to(GetAllPendingSlotsUseCase);
container.bind(TYPES_BOOKINGSLOT_USECASAES.GetPendingSlotsUseCase).to(GetPendingSlotsUseCase);
container.bind(TYPES_BOOKINGSLOT_USECASAES.GetUpComingSlotsUseCase).to(GetUpComingSlotsUseCase);

//Bind Chat Use Cases
container.bind(TYPES_CHAT_USECASES.CreateMessageUseCase).to(CreateMessageUseCase);
container.bind(TYPES_CHAT_USECASES.GetChatHistoryUseCase).to(GetChatHistoryUseCase);
container.bind(TYPES_CHAT_USECASES.GetTrainerChatListUseCase).to(GetTrainerChatListUseCase);
container.bind(TYPES_CHAT_USECASES.GetUserChatListUseCase).to(GetUserChatListUseCase);
container.bind(TYPES_CHAT_USECASES.IncrementUnReadMessageCountUseCase).to(IncrementUnReadMessageCountUseCase);
container.bind(TYPES_CHAT_USECASES.MarkMessageAsReadUseCase).to(MarkMessageAsReadUseCase);
container.bind(TYPES_CHAT_USECASES.UpdateLastMessageUseCase).to(UpdateLastMessageUseCase);
container.bind(TYPES_CHAT_USECASES.UpdateUnReadMessageCountUseCase1).to(UpdateUnReadMessageCountUseCase);

//Bind Dashboard Use Cases
container.bind(TYPES_DASHBOARD_USECASES.AdminDashBoardUseCase).to(AdminDashBoardUseCase);
container.bind(TYPES_DASHBOARD_USECASES.TrainerDashBoardUseCase).to(TrainerDashBoardUseCase);
container.bind(TYPES_DASHBOARD_USECASES.UserDashBoardUseCase).to(UserDashBoardUseCase);

//Bind Platform Use Cases
container.bind(TYPES_PLATFORM_USECASES.GetPlatformEarningsUsecase).to(GetPlatformEarningsUsecase);

//Bind Playlist Use Cases
container.bind(TYPES_PLAYLIST_USECASES.CreatePlayListUseCase).to(CreatePlayListUseCase);
container.bind(TYPES_PLAYLIST_USECASES.EditPlayListUseCase).to(EditPlayListUseCase);
container.bind(TYPES_PLAYLIST_USECASES.GetallPlaylistUseCase).to(GetallPlaylistUseCase);
container.bind(TYPES_PLAYLIST_USECASES.GetPlayListUseCase).to(GetPlayListUseCase);
container.bind(TYPES_PLAYLIST_USECASES.UpdatePlayListPrivacyUseCase).to(UpdatePlayListPrivacyUseCase);

//Bind Subscription Use Cases
container.bind(TYPES_SUBSCRIPTION_USECASES.SubscriptionBlockUseCase).to(SubscriptionBlockUseCase);
container.bind(TYPES_SUBSCRIPTION_USECASES.CancelSubscriptionUseCase).to(CancelSubscriptionUseCase);
container.bind(TYPES_SUBSCRIPTION_USECASES.CheckSubscriptionStatusUseCase).to(CheckSubscriptionStatusUseCase);
container.bind(TYPES_SUBSCRIPTION_USECASES.CreateSubscriptionUseCase).to(CreateSubscriptionUseCase);
container.bind(TYPES_SUBSCRIPTION_USECASES.DeleteSubscriptionUseCase).to(DeleteSubscriptionUseCase);
container.bind(TYPES_SUBSCRIPTION_USECASES.EditSubscriptionUseCase).to(EditSubscriptionUseCase);
container.bind(TYPES_SUBSCRIPTION_USECASES.GetTrainerSubscribersUseCase).to(GetTrainerSubscribersUseCase);
container.bind(TYPES_SUBSCRIPTION_USECASES.GetTrainerSubscriptionsUseCase).to(GetTrainerSubscriptionsUseCase);
container.bind(TYPES_SUBSCRIPTION_USECASES.GetUserSubscriptionUseCase).to(GetUserSubscriptionUseCase);
container.bind(TYPES_SUBSCRIPTION_USECASES.GetUserTrainerslistUseCase).to(GetUserTrainerslistUseCase);
container.bind(TYPES_SUBSCRIPTION_USECASES.PurchaseSubscriptionUseCase).to(PurchaseSubscriptionUseCase);
container.bind(TYPES_SUBSCRIPTION_USECASES.VerifySubcriptionSessionUseCase).to(VerifySubcriptionSessionUseCase);
container.bind(TYPES_SUBSCRIPTION_USECASES.WebHookHandlerUseCase).to(WebHookHandlerUseCase);

//Bind Trainer Use Cases
container.bind(TYPES_TRAINER_USECASES.GetApprovedTrainersUseCase).to(GetApprovedTrainersUseCase);
container.bind(TYPES_TRAINER_USECASES.GetTrainerDetailsUseCase).to(GetTrainerDetailsUseCase);
container.bind(TYPES_TRAINER_USECASES.GetTrainerAndSubInfoUseCase).to(GetTrainerAndSubInfoUseCase);
container.bind(TYPES_TRAINER_USECASES.GetTrainersUseCase).to(GetTrainersUseCase);
container.bind(TYPES_TRAINER_USECASES.GetVerifyTrainerlistUseCase).to(GetVerifyTrainerlistUseCase);
container.bind(TYPES_TRAINER_USECASES.TrainerApprovalUseCase).to(TrainerApprovalUseCase);

//Bind User Use Cases
container.bind(TYPES_USER_USECASES.GetUserDetailsUseCase).to(GetUserDetailsUseCase);
container.bind(TYPES_USER_USECASES.GetUsersUseCase).to(GetUsersUseCase);
container.bind(TYPES_USER_USECASES.UpdateUserBlockStatusUseCase).to(UpdateUserBlockStatusUseCase);

//Bind Video Use Cases
container.bind(TYPES_VIDEO_USECASES.CreateVideoUseCase).to(CreateVideoUseCase);
container.bind(TYPES_VIDEO_USECASES.EditVideoUseCase).to(EditVideoUseCase);
container.bind(TYPES_VIDEO_USECASES.GetVideoDetailsUseCase).to(GetVideoDetailsUseCase);
container.bind(TYPES_VIDEO_USECASES.GetVideosUseCase).to(GetVideosUseCase);
container.bind(TYPES_VIDEO_USECASES.UpdateVideoPrivacyUseCase).to(UpdateVideoPrivacyUseCase);

//Bind Video Call Use Cases
container.bind(TYPES_VIDEO_CALL_LOG_USECASES.CreateVideoCallLogUseCase).to(CreateVideoCallLogUseCase);
container.bind(TYPES_VIDEO_CALL_LOG_USECASES.UpdateVideoCallDurationUseCase).to(UpdateVideoCallDurationUseCase);
container.bind(TYPES_VIDEO_CALL_LOG_USECASES.UpdateVideoCallStatusUseCase).to(UpdateVideoCallStatusUseCase);
container.bind(TYPES_VIDEO_CALL_LOG_USECASES.GetTrainerVideoCallLogUseCase).to(GetTrainerVideoCallLogUseCase);
container.bind(TYPES_VIDEO_CALL_LOG_USECASES.GetUserVideoCallLogUseCase).to(GetUserVideoCallLogUseCase);

container.bind(TYPES_WORKOUT_USECASES.CompleteWorkoutUseCase).to(CompleteWorkoutUseCase);
container.bind(TYPES_WORKOUT_USECASES.CreateWorkoutUseCase).to(CreateWorkoutUseCase);
container.bind(TYPES_WORKOUT_USECASES.DeleteWorkoutUseCase).to(DeleteWorkoutUseCase);
container.bind(TYPES_WORKOUT_USECASES.GetWorkoutUseCase).to(GetWorkoutUseCase);

//Logger Use Cases
container.bind(TYPES_LOGGER_USECASES.LoggerUseCase).to(LoggerUseCase)

// Appointment Controllers 
container.bind(TYPES_APPOINTMENT_CONTROLLER.BookAppointmentController).to(BookAppointmentController);
container.bind(TYPES_APPOINTMENT_CONTROLLER.CancelAppointmentController).to(CancelAppointmentController);
container.bind(TYPES_APPOINTMENT_CONTROLLER.GetBookingRequestsController).to(GetBookingRequestsController);
container.bind(TYPES_APPOINTMENT_CONTROLLER.GetTrainerSchedulesController).to(GetTrainerSchedulesController);
container.bind(TYPES_APPOINTMENT_CONTROLLER.GetUserSchedulesController).to(GetUserSchedulesController);
container.bind(TYPES_APPOINTMENT_CONTROLLER.UpdateAppointmentController).to(UpdateAppointmentController);

// Auth Controllers 
container.bind(TYPES_AUTH_CONTROLLER.ChangePasswordController).to(ChangePasswordController);
container.bind(TYPES_AUTH_CONTROLLER.ForgotPasswordController).to(ForgotPasswordController);
container.bind(TYPES_AUTH_CONTROLLER.PasswordResetLinkController).to(PasswordResetLinkController);
container.bind(TYPES_AUTH_CONTROLLER.GoogleAuthController).to(GoogleAuthController);
container.bind(TYPES_AUTH_CONTROLLER.OtpController).to(OtpController);
container.bind(TYPES_AUTH_CONTROLLER.RefreshAccessTokenController).to(RefreshAccessTokenController);
container.bind(TYPES_AUTH_CONTROLLER.SignInController).to(SignInController);
container.bind(TYPES_AUTH_CONTROLLER.SignOutController).to(SignOutController);
container.bind(TYPES_AUTH_CONTROLLER.SignUpTrainerController).to(SignUpTrainerController);
container.bind(TYPES_AUTH_CONTROLLER.SignUpUserController).to(SignUpUserController);
container.bind(TYPES_AUTH_CONTROLLER.UpdateTrainerProfileController).to(UpdateTrainerProfileController);
container.bind(TYPES_AUTH_CONTROLLER.UpdateUserProfileController).to(UpdateUserProfileController);

// Booking Controllers 
container.bind(TYPES_BOOKING_CONTROLLER.CreateBookingSlotController).to(CreateBookingSlotController);
container.bind(TYPES_BOOKING_CONTROLLER.DeleteBookingSlotController).to(DeleteBookingSlotController);
container.bind(TYPES_BOOKING_CONTROLLER.GetAllPendingSlotsController).to(GetAllPendingSlotsController);
container.bind(TYPES_BOOKING_CONTROLLER.GetPendingSlotsController).to(GetPendingSlotsController);
container.bind(TYPES_BOOKING_CONTROLLER.GetUpComingSlotsController).to(GetUpComingSlotsController);

// Chat Controllers 
container.bind(TYPES_CHAT_CONTROLLER.GetChatsController).to(GetChatsController)
container.bind(TYPES_CHAT_CONTROLLER.GetTrainerContactsController).to(GetTrainerContactsController)
container.bind(TYPES_CHAT_CONTROLLER.GetUserContactsController).to(GetUserContactsController)

// Dashboard Controllers 
container.bind(TYPES_DASHBOARD_CONTROLLER.AdminDashboardController).to(AdminDashboardController);
container.bind(TYPES_DASHBOARD_CONTROLLER.TrainerDashboardController).to(TrainerDashboardController);
container.bind(TYPES_DASHBOARD_CONTROLLER.UserDashboardController).to(UserDashboardController);

// Platform Controllers 
container.bind(TYPES_PLATFORM_CONTROLLER.GetPlatformEarningsController).to(GetPlatformEarningsController);

// Playlist Controllers 
container.bind(TYPES_PLAYLIST_CONTROLLER.CreatePlaylistController).to(CreatePlaylistController);
container.bind(TYPES_PLAYLIST_CONTROLLER.EditPlaylistController).to(EditPlaylistController);
container.bind(TYPES_PLAYLIST_CONTROLLER.GetAllPublicPlaylistController).to(GetAllPublicPlaylistController);
container.bind(TYPES_PLAYLIST_CONTROLLER.GetAllPlaylistController).to(GetAllPlaylistController);
container.bind(TYPES_PLAYLIST_CONTROLLER.GetPlaylistController).to(GetPlaylistController);
container.bind(TYPES_PLAYLIST_CONTROLLER.UpdatePlaylistPrivacyController).to(UpdatePlaylistPrivacyController);

// Subscription Controllers 
container.bind(TYPES_SUBSCRIPTION_CONTROLLER.CancelSubscriptionController).to(CancelSubscriptionController);
container.bind(TYPES_SUBSCRIPTION_CONTROLLER.CheckSubscriptionStatusController).to(CheckSubscriptionStatusController);
container.bind(TYPES_SUBSCRIPTION_CONTROLLER.GetTrainerSubscribersController).to(GetTrainerSubscribersController);
container.bind(TYPES_SUBSCRIPTION_CONTROLLER.GetTrainerSubscriptionController).to(GetTrainerSubscriptionController);
container.bind(TYPES_SUBSCRIPTION_CONTROLLER.GetUserSubscriptionController).to(GetUserSubscriptionController);
container.bind(TYPES_SUBSCRIPTION_CONTROLLER.PurchaseSubscriptionController).to(PurchaseSubscriptionController);
container.bind(TYPES_SUBSCRIPTION_CONTROLLER.SubscriptionPlanController).to(SubscriptionPlanController);
container.bind(TYPES_SUBSCRIPTION_CONTROLLER.VerifySubscriptionController).to(VerifySubscriptionController);
container.bind(TYPES_SUBSCRIPTION_CONTROLLER.WebhookController).to(WebhookController);

// Trainer Controllers 
container.bind(TYPES_TRAINER_CONTROLLER.GetallTrainersController).to(GetallTrainersController);
container.bind(TYPES_TRAINER_CONTROLLER.GetApprovedTrainersController).to(GetApprovedTrainersController);
container.bind(TYPES_TRAINER_CONTROLLER.GetTrainerDetailsController).to(GetTrainerDetailsController);
container.bind(TYPES_TRAINER_CONTROLLER.GetTrainerWithSubController).to(GetTrainerWithSubController);
container.bind(TYPES_TRAINER_CONTROLLER.GetUserMyTrainersController).to(GetUserMyTrainersController);
container.bind(TYPES_TRAINER_CONTROLLER.GetVerifyTrainerController).to(GetVerifyTrainerController);
container.bind(TYPES_TRAINER_CONTROLLER.VerifyTrainerController).to(VerifyTrainerController);

// User Controllers 
container.bind(TYPES_USER_CONTROLLER.GetUserDetailsController).to(GetUserDetailsController);
container.bind(TYPES_USER_CONTROLLER.GetUsersController).to(GetUsersController);
container.bind(TYPES_USER_CONTROLLER.UpdateUserBlockStatusController).to(UpdateUserBlockStatusController);

// Video Controllers 
container.bind(TYPES_VIDEO_CONTROLLER.AddVideoController).to(AddVideoController);
container.bind(TYPES_VIDEO_CONTROLLER.EditVideoController).to(EditVideoController);
container.bind(TYPES_VIDEO_CONTROLLER.GetAllVideosController).to(GetAllVideosController);
container.bind(TYPES_VIDEO_CONTROLLER.GetPublicVideosController).to(GetPublicVideosController);
container.bind(TYPES_VIDEO_CONTROLLER.GetPublicVideoDetailsController).to(GetPublicVideoDetailsController);
container.bind(TYPES_VIDEO_CONTROLLER.GetVideoDetailsController).to(GetVideoDetailsController);
container.bind(TYPES_VIDEO_CONTROLLER.UpdateVideoStatusController).to(UpdateVideoStatusController);

// Video Call Log Controllers 
container.bind(TYPES_VIDEOCALLLOG_CONTROLLER.GetTrainerVideoCallLogController).to(GetTrainerVideoCallLogController);
container.bind(TYPES_VIDEOCALLLOG_CONTROLLER.GetUserVideoCallLogController).to(GetUserVideoCallLogController);

// Workout Controllers 
container.bind(TYPES_WORKOUT_CONTROLLER.AddWorkoutController).to(AddWorkoutController);
container.bind(TYPES_WORKOUT_CONTROLLER.DeleteWorkoutController).to(DeleteWorkoutController);
container.bind(TYPES_WORKOUT_CONTROLLER.GetWorkoutController).to(GetWorkoutController);
container.bind(TYPES_WORKOUT_CONTROLLER.UpdateWorkoutController).to(UpdateWorkoutController);

export { container };