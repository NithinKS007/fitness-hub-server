import { UserRepository } from "@infrastructure/databases/repositories/user.repository";
import { TrainerRepository } from "@infrastructure/databases/repositories/trainer.repository";
import { SubscriptionRepository } from "@infrastructure/databases/repositories/subscription.repository";
import { UserSubscriptionPlanRepository } from "@infrastructure/databases/repositories/user-subscription-plan.repository";
import { RevenueRepository } from "@infrastructure/databases/repositories/revenue.repository";
import { GetPlatformEarningsUsecase } from "@application/usecases/platform/get-platfrom-earnings.usecase";
import { StripePaymentService } from "@infrastructure/services/payments/stripe.service";
import { GetTrainerSubscriptionsUseCase } from "@application/usecases/subscription/get-trainer-subscriptions.usecase";
import { TrainerApprovalUseCase } from "@application/usecases/trainer/trainer-approval.usecase";
import { AdminDashBoardUseCase } from "@application/usecases/dashboard/admin-dashboard.usecase";
import { CreateUserUseCase } from "@application/usecases/auth/create-user.usecase";
import { SigninUserUseCase } from "@application/usecases/auth/signin-user.usecase";
import { OtpUseCase } from "@application/usecases/auth/otp.usecase";
import { GoogleAuthUseCase } from "@application/usecases/auth/google-auth.usecase";
import { CreateTrainerUseCase } from "@application/usecases/auth/create-trainer.usecase";
import { UpdateTrainerProfileUseCase } from "@application/usecases/auth/update-trainer-profile.usecase";
import { PasswordResetRepository } from "@infrastructure/databases/repositories/passwordreset.repository";
import { OtpRepository } from "@infrastructure/databases/repositories/otp.repository";
import { JwtService } from "@infrastructure/services/auth/jwt.service";
import { TokenUseCase } from "@application/usecases/auth/token.usecase";
import { CloudinaryService } from "@infrastructure/services/storage/cloudinary.service";
import { GoogleAuthService } from "@infrastructure/services/auth/google.auth.service";
import { EmailService } from "@infrastructure/services/communication/email.service";
import { AdminDashboardController } from "@presentation/controllers/dashboard/admin-dashboard.controller";
import { ChatRepository } from "@infrastructure/databases/repositories/chat.repository";
import { ConversationRepository } from "@infrastructure/databases/repositories/conversation.repository";
import { ChatController } from "@presentation/controllers/chat/chat.controller";
import { GetUserSubscriptionUseCase } from "@application/usecases/subscription/get-user-subscription.usecase";
import { GetApprovedTrainersController } from "@presentation/controllers/trainer/get-approved-trainers.controller";
import { PurchaseSubscriptionController } from "@presentation/controllers/subscription/purchase-subscription.controller";
import { PurchaseSubscriptionUseCase } from "@application/usecases/subscription/purchase-subscription.usecase";
import { CancelSubscriptionUseCase } from "@application/usecases/subscription/cancel-subscription.usecase";
import { GetUserSubscriptionController } from "@presentation/controllers/subscription/get-user-subscriptions.controller";
import { CheckSubscriptionStatusUseCase } from "@application/usecases/subscription/check-subscription-status.usecase";
import { WebhookController } from "@presentation/controllers/subscription/webhook.controller";
import { WebHookHandlerUseCase } from "@application/usecases/subscription/webhook-handler.usecase";
import { PlayListRepository } from "@infrastructure/databases/repositories/playlist.repository";
import { VideoRepository } from "@infrastructure/databases/repositories/video.repository";
import { VideoPlayListRepository } from "@infrastructure/databases/repositories/video-playlist.repository";
import { EditVideoUseCase } from "@application/usecases/video/edit-video.usecase";
import { CreateVideoUseCase } from "@application/usecases/video/create-video.usecase";
import { UpdateVideoPrivacyUseCase } from "@application/usecases/video/update-video.privacy.usecase";
import { GetVideosUseCase } from "@application/usecases/video/get-video.usecase";
import { WorkoutRepository } from "@infrastructure/databases/repositories/workout.repository";
import { CreateWorkoutUseCase } from "@application/usecases/workout/create-workout.usecase";
import { GetWorkoutUseCase } from "@application/usecases/workout/get-workout.usecase";
import { BookingSlotRepository } from "@infrastructure/databases/repositories/bookingslot.repository";
import { AppointmentRepository } from "@infrastructure/databases/repositories/appointment.repository";
import { BookAppointmentUseCase } from "@application/usecases/appointment/book-appointment-usecase";
import { BookAppointmentController } from "@presentation/controllers/appointment/book-appointment.controller";
import { UserDashBoardUseCase } from "@application/usecases/dashboard/user-dashboard.usecase";
import { UserDashboardController } from "@presentation/controllers/dashboard/user-dashboard.controller";
import { CreatePlayListUseCase } from "@application/usecases/playlist/create-playlist.usecase";
import { EditPlayListUseCase } from "@application/usecases/playlist/edit-playlist.usecase";
import { GetallPlaylistUseCase } from "@application/usecases/playlist/get-all-playlist.usecase";
import { GetPlayListUseCase } from "@application/usecases/playlist/get-playlist.usecase";
import { UpdatePlayListPrivacyUseCase } from "@application/usecases/playlist/update-playlist-privacy.usecase";
import { DeleteBookingSlotUseCase } from "@application/usecases/bookingSlot/delete-booking-slot.usecase";
import { CreateBookingSlotUseCase } from "@application/usecases/bookingSlot/create-booking-slot.usecase";
import { TrainerDashBoardUseCase } from "@application/usecases/dashboard/trainer-dashboard.usecase";
import { TrainerDashboardController } from "@presentation/controllers/dashboard/trainer-dashboard.controller";
import { VideoCallLogRepository } from "@infrastructure/databases/repositories/video-calllog.repository";
import { GetTrainerVideoCallLogUseCase } from "@application/usecases/videoCallLog/get-trainer-video-calllog.usecase";
import { GetUserVideoCallLogUseCase } from "@application/usecases/videoCallLog/get-user-video-calllog.usecase";
import { CreateSubscriptionUseCase } from "@application/usecases/subscription/create-subscription.usecase";
import { EditSubscriptionUseCase } from "@application/usecases/subscription/edit-subscription.usecase";
import { DeleteSubscriptionUseCase } from "@application/usecases/subscription/delete-subscription.usecase";
import { SubscriptionBlockUseCase } from "@application/usecases/subscription/block-subscription.usecase";
import { SubscriptionPlanController } from "@presentation/controllers/subscription/subscription-plan.controller";
import { GetTrainerSubscribersController } from "@presentation/controllers/subscription/get-trainer-subscribers.controller";
import { UpdateAppointmentController } from "@presentation/controllers/appointment/update-appointment.controller";
import { OtpController } from "@presentation/controllers/auth/otp.controller";
import { GoogleAuthController } from "@presentation/controllers/auth/google-auth.controller";
import { AddVideoController } from "@presentation/controllers/video/add-video.controller";
import { EditVideoController } from "@presentation/controllers/video/edit-video.controller";
import { UpdateVideoStatusController } from "@presentation/controllers/video/update-video-status.controller";
import { GetUserVideoCallLogController } from "@presentation/controllers/videoCallLog/user-calllogs.controller";
import { GetTrainerVideoCallLogController } from "@presentation/controllers/videoCallLog/trainer-calllogs.controller";
import { DeleteBookingSlotController } from "@presentation/controllers/booking/deleting-booking.controller";
import { CreateBookingSlotController } from "@presentation/controllers/booking/create-booking.controller";
import { OTPService } from "@infrastructure/services/security/otp.service";
import { EncryptionService } from "@infrastructure/services/security/encryption.service";
import { HashService } from "@infrastructure/services/security/hash.service";
import { CreatePlaylistController } from "@presentation/controllers/playlist/create-playlist.controller";
import { EditPlaylistController } from "@presentation/controllers/playlist/edit-playlist.controller";
import { GetPlaylistController } from "@presentation/controllers/playlist/get-playlist.controller";
import { UpdatePlaylistPrivacyController } from "@presentation/controllers/playlist/update-playlist-status.controller";
import { GetPlatformEarningsController } from "@presentation/controllers/platform/get-platform-earnings.controller";
import { VerifyTrainerController } from "@presentation/controllers/trainer/verify-trainer.controller";
import { GetUsersController } from "@presentation/controllers/user/get-user.controller";
import { UpdateUserBlockStatusController } from "@presentation/controllers/user/update-user-block-status.controller";
import { GetVerifyTrainerController } from "@presentation/controllers/trainer/get-verify-trainer.controller";
import { GetUserMyTrainersController } from "@presentation/controllers/trainer/get-user-my-trainerslist.controller";
import { GetTrainerWithSubController } from "@presentation/controllers/trainer/get-trainer-with-sub.controller";
import { GetallTrainersController } from "@presentation/controllers/trainer/get-all-trainers.controller";
import { GetTrainerDetailsController } from "@presentation/controllers/trainer/get-trainer-details.controller";
import { AddWorkoutController } from "@presentation/controllers/workout/add-workout.controller";
import { GetWorkoutController } from "@presentation/controllers/workout/get-workout.controller";
import { DeleteWorkoutController } from "@presentation/controllers/workout/delete-workout.controller";
import { UpdateWorkoutController } from "@presentation/controllers/workout/update-workout.controller";
import { DateService } from "@infrastructure/services/date/date.service";
import { GetAppointmentRequestUseCase } from "@application/usecases/appointment/get-appointment-request.usecase";
import { CancelAppointmentUseCase } from "@application/usecases/appointment/cancel-appointment.usecase";
import { HandleBookingApprovalUseCase } from "@application/usecases/appointment/handle-booking.usecase";
import { GetTrainerSchedulesUseCase } from "@application/usecases/appointment/get-trainer-schedules";
import { GetUserSchedulesUseCase } from "@application/usecases/appointment/get-user-schedules";
import { UpdateUserProfileUseCase } from "@application/usecases/auth/update-user-profile.usecase";
import { GetTrainerSubscribersUseCase } from "@application/usecases/subscription/get-trainer-subscribed-users.usecase";
import { DeleteWorkoutUseCase } from "@application/usecases/workout/delete-workout-usecase";
import { CompleteWorkoutUseCase } from "@application/usecases/workout/complete-workout.usecase";
import { GetPendingSlotsUseCase } from "@application/usecases/bookingSlot/get-pending-slots";
import { GetAllPendingSlotsUseCase } from "@application/usecases/bookingSlot/get-all-pending-slots";
import { GetUpComingSlotsUseCase } from "@application/usecases/bookingSlot/get-upcoming-slots";
import { GetChatHistoryUseCase } from "@application/usecases/chat/get-chat-history.usecase";
import { GetTrainerChatListUseCase } from "@application/usecases/chat/get-trainer-chat-list.usecase";
import { GetUserChatListUseCase } from "@application/usecases/chat/get-user-chat-list.usecase";
import { GetUsersUseCase } from "@application/usecases/user/get-users.usecase";
import { GetUserDetailsUseCase } from "@application/usecases/user/get-user-details.usecase";
import { UpdateUserBlockStatusUseCase } from "@application/usecases/user/update-user-block-status.usecase";
import { GetApprovedTrainersUseCase } from "@application/usecases/trainer/get-approved-trainers.usecase";
import { GetTrainerDetailsUseCase } from "@application/usecases/trainer/get-trainer-details.usecase";
import { GetTrainerAndSubInfoUseCase } from "@application/usecases/trainer/get-trainer-with-subscription";
import { GetTrainersUseCase } from "@application/usecases/trainer/get-trainers-usecase";
import { GetVerifyTrainerlistUseCase } from "@application/usecases/trainer/get-verify-trainer-list.usecase";
import { GetUserTrainerslistUseCase } from "@application/usecases/subscription/get-user-trainers-list.usecase";
import { VerifySubcriptionSessionUseCase } from "@application/usecases/subscription/verify-subscription-session.usecase";
import { GetVideoDetailsUseCase } from "@application/usecases/video/get-video-details";
import { SignUpTrainerController } from "@presentation/controllers/auth/sign-up-trainer.controller";
import { SignUpUserController } from "@presentation/controllers/auth/sign-up-user.controller";
import { UpdateTrainerProfileController } from "@presentation/controllers/auth/update-trainer-profile.controller";
import { UpdateUserProfileController } from "@presentation/controllers/auth/update-user-Profile.controller";
import { GetBookingRequestsController } from "@presentation/controllers/appointment/get-booking-requests.controller";
import { GetTrainerSchedulesController } from "@presentation/controllers/appointment/get-trainer-schedules.controller";
import { GetUserSchedulescontroller } from "@presentation/controllers/appointment/get-user-schedules.controller";
import { CancelAppointmentController } from "@presentation/controllers/appointment/cancel-appointment.controller";
import { GetPendingSlotsController } from "@presentation/controllers/booking/get-pending-slots.controller";
import { GetAllPendingSlotsController } from "@presentation/controllers/booking/get-all-pending-slots.controller";
import { GetUpComingSlotsController } from "@presentation/controllers/booking/get-upcoming-slots.controller";
import { GetAllPlaylistController } from "@presentation/controllers/playlist/get-all-playlists.controller";
import { VerifySubscriptionController } from "@presentation/controllers/subscription/verify-subscription.controller";
import { CancelSubscriptionController } from "@presentation/controllers/subscription/cancel-subscription.controller";
import { CheckSubscriptionStatusController } from "@presentation/controllers/subscription/check-subscription-status.controller";
import { GetTrainerSubscriptionController } from "@presentation/controllers/subscription/get-trainer-subscriptions.controller";
import { GetUserDetailsController } from "@presentation/controllers/user/get-user-details.controller";
import { GetAllVideosController } from "@presentation/controllers/video/get-all-videos.controller";
import { GetPublicVideosController } from "@presentation/controllers/video/get-public-videos.controller";
import { GetVideoDetailsController } from "@presentation/controllers/video/get-video-details.controller";
import { ChangePasswordUseCase } from "@application/usecases/auth/change-password.usecase";
import { ForgotPasswordUseCase } from "@application/usecases/auth/forgot-password.usecase";
import { SendPasswordRestLinkUseCase } from "@application/usecases/auth/send-password-reset-ink.usecase";
import { GetPublicVideoDetailsController } from "@presentation/controllers/video/get-public-video-details.controller";
import { ChangePasswordController } from "@presentation/controllers/auth/change-password.controller";
import { PasswordResetLinkController } from "@presentation/controllers/auth/generate-password-link.controller";
import { ForgotPasswordController } from "@presentation/controllers/auth/forgot-password.controller";
import { SignInController } from "@presentation/controllers/auth/sign-in.controller";
import { RefreshAccessTokenController } from "@presentation/controllers/auth/refresh-access-token.controller";
import { SignOutController } from "@presentation/controllers/auth/sign-out.controller";
import { GetAllPublicPlaylistController } from "@presentation/controllers/playlist/get-all-playlist-public.controller";

//SERVICE INSTANCES
const cloudinaryService = new CloudinaryService();
const jwtService = new JwtService();
const emailService = new EmailService();
const googleAuthService = new GoogleAuthService();

//REPOSITORY INSTANCES
const trainerRepository = new TrainerRepository();
const subscriptionRepository = new SubscriptionRepository();
const userSubscriptionPlanRepository = new UserSubscriptionPlanRepository();
const revenueRepository = new RevenueRepository();
const userRepository = new UserRepository();
const otpRepository = new OtpRepository();
const passwordResetRepository = new PasswordResetRepository();
const chatRepository = new ChatRepository();
const conversationRepository = new ConversationRepository();
const playListRepository = new PlayListRepository();
const videoRepository = new VideoRepository();
const videoPlayListRepository = new VideoPlayListRepository();
const workoutRepository = new WorkoutRepository();
const bookingSlotRepository = new BookingSlotRepository();
const appointmentRepository = new AppointmentRepository();
const videoCallLogRepository = new VideoCallLogRepository();

//USE CASE INSTANCES
const getUsersUseCase = new GetUsersUseCase(userRepository);
const getUserDetailsUseCase = new GetUserDetailsUseCase(userRepository);
const updateUserBlockStatusUseCase = new UpdateUserBlockStatusUseCase(
  userRepository
);

const getApprovedTrainersUseCase = new GetApprovedTrainersUseCase(
  trainerRepository
);
const getTrainerDetailsUseCase = new GetTrainerDetailsUseCase(
  trainerRepository
);
const getTrainerAndSubInfoUseCase = new GetTrainerAndSubInfoUseCase(
  trainerRepository
);
const getTrainersUseCase = new GetTrainersUseCase(trainerRepository);
const getVerifyTrainerlistUseCase = new GetVerifyTrainerlistUseCase(
  trainerRepository
);

const stripeService = new StripePaymentService();
const otpService = new OTPService();
const encryptionService = new EncryptionService();
const hashService = new HashService();
const dateService = new DateService();

const getTrainerSubscriptionsUseCase = new GetTrainerSubscriptionsUseCase(
  subscriptionRepository
);

const getTrainerSubscribersUseCase = new GetTrainerSubscribersUseCase(
  userSubscriptionPlanRepository,
  stripeService
);

const trainerApprovalUseCase = new TrainerApprovalUseCase(trainerRepository);
const adminDashBoardUseCase = new AdminDashBoardUseCase(
  userSubscriptionPlanRepository,
  userRepository,
  trainerRepository,
  revenueRepository,
  dateService
);

const createUserUseCase = new CreateUserUseCase(
  userRepository,
  otpRepository,
  emailService,
  otpService,
  encryptionService
);
const signinUseCase = new SigninUserUseCase(
  userRepository,
  trainerRepository,
  jwtService,
  encryptionService
);
const otpUseCase = new OtpUseCase(
  otpRepository,
  userRepository,
  emailService,
  otpService
);

const googleAuthUseCase = new GoogleAuthUseCase(
  userRepository,
  jwtService,
  googleAuthService
);
const updateTrainerProfileUseCase = new UpdateTrainerProfileUseCase(
  userRepository,
  trainerRepository,
  cloudinaryService
);
const createTrainerUseCase = new CreateTrainerUseCase(
  userRepository,
  otpRepository,
  trainerRepository,
  emailService,
  otpService,
  encryptionService
);
const refreshAccessTokenUseCase = new TokenUseCase(jwtService);

const getChatHistoryUseCase = new GetChatHistoryUseCase(chatRepository);
const getTrainerChatListUseCase = new GetTrainerChatListUseCase(
  conversationRepository
);
const getUserChatListUseCase = new GetUserChatListUseCase(
  conversationRepository
);

const getUserSubscriptionUseCase = new GetUserSubscriptionUseCase(
  userSubscriptionPlanRepository,
  stripeService
);

const purchaseSubscriptionUseCase = new PurchaseSubscriptionUseCase(
  subscriptionRepository,
  stripeService
);
const cancelSubscriptionUseCase = new CancelSubscriptionUseCase(stripeService);

const checkSubscriptionStatusUseCase = new CheckSubscriptionStatusUseCase(
  userSubscriptionPlanRepository,
  stripeService
);
const webHookHandlerUseCase = new WebHookHandlerUseCase(
  subscriptionRepository,
  userSubscriptionPlanRepository,
  revenueRepository,
  conversationRepository,
  stripeService,
  emailService,
  userRepository
);

const editVideoUseCase = new EditVideoUseCase(
  playListRepository,
  videoRepository,
  videoPlayListRepository
);

const createVideoUseCase = new CreateVideoUseCase(
  playListRepository,
  videoRepository,
  videoPlayListRepository
);

const updateVideoPrivacyUseCase = new UpdateVideoPrivacyUseCase(
  videoRepository
);
const getVideoUseCase = new GetVideosUseCase(videoRepository);
const createWorkoutUseCase = new CreateWorkoutUseCase(workoutRepository);
const getWorkoutUseCase = new GetWorkoutUseCase(workoutRepository);
const bookAppointmentUseCase = new BookAppointmentUseCase(
  bookingSlotRepository,
  appointmentRepository
);

const getTrainerSchedulesUseCase = new GetTrainerSchedulesUseCase(
  appointmentRepository
);
const getAppointmentRequestUseCase = new GetAppointmentRequestUseCase(
  appointmentRepository
);

const getUserSchedulesUseCase = new GetUserSchedulesUseCase(
  appointmentRepository
);
const handleBookingApprovalUseCase = new HandleBookingApprovalUseCase(
  bookingSlotRepository,
  appointmentRepository
);

const cancelAppointmentUseCase = new CancelAppointmentUseCase(
  bookingSlotRepository,
  appointmentRepository
);

const userDashBoardUseCase = new UserDashBoardUseCase(
  workoutRepository,
  dateService
);

const createPlayListUseCase = new CreatePlayListUseCase(playListRepository);

const editPlayListUseCase = new EditPlayListUseCase(playListRepository);
const getallPlaylistUseCase = new GetallPlaylistUseCase(playListRepository);
const getPlayListUseCase = new GetPlayListUseCase(playListRepository);
const updatePlayListPrivacyUseCase = new UpdatePlayListPrivacyUseCase(
  playListRepository
);
const createBookingSlotUseCase = new CreateBookingSlotUseCase(
  bookingSlotRepository
);
const deleteBookingSlotUseCase = new DeleteBookingSlotUseCase(
  bookingSlotRepository
);

const getPendingSlotsUseCase = new GetPendingSlotsUseCase(
  bookingSlotRepository
);

const getAllPendingSlotsUseCase = new GetAllPendingSlotsUseCase(
  bookingSlotRepository
);

const getUpComingSlotsUseCase = new GetUpComingSlotsUseCase(
  bookingSlotRepository
);

const trainerDashBoardUseCase = new TrainerDashBoardUseCase(
  userSubscriptionPlanRepository,
  dateService
);
const trainerVideoCallLogUseCase = new GetTrainerVideoCallLogUseCase(
  videoCallLogRepository
);
const userVideoCallLogUseCase = new GetUserVideoCallLogUseCase(
  videoCallLogRepository
);

const createSubscriptionUseCase = new CreateSubscriptionUseCase(
  subscriptionRepository,
  trainerRepository,
  stripeService
);

const editSubscriptionUseCase = new EditSubscriptionUseCase(
  subscriptionRepository,
  trainerRepository,
  stripeService
);

const deleteSubscriptionUseCase = new DeleteSubscriptionUseCase(
  subscriptionRepository,
  stripeService
);

const subscriptionBlockUseCase = new SubscriptionBlockUseCase(
  subscriptionRepository
);
//CONTROLLER INSTANCES

export const getallTrainersController = new GetallTrainersController(
  getTrainersUseCase
);

export const getTrainerDetailsController = new GetTrainerDetailsController(
  getTrainerDetailsUseCase
);
export const getPlatformEarningsUsecase = new GetPlatformEarningsUsecase(
  revenueRepository
);
export const getPlatformEarningsController = new GetPlatformEarningsController(
  getPlatformEarningsUsecase
);

export const verifyTrainerController = new VerifyTrainerController(
  trainerApprovalUseCase
);

export const getUsersController = new GetUsersController(getUsersUseCase);

export const getUserDetailsController = new GetUserDetailsController(
  getUserDetailsUseCase
);
export const updateUserBlockStatusController =
  new UpdateUserBlockStatusController(updateUserBlockStatusUseCase);

export const adminDashboardController = new AdminDashboardController(
  adminDashBoardUseCase
);
export const signOutController = new SignOutController();
export const signInController = new SignInController(signinUseCase);
export const refreshAccessTokenController = new RefreshAccessTokenController(
  refreshAccessTokenUseCase
);

export const signUpTrainerController = new SignUpTrainerController(
  createTrainerUseCase
);
export const signUpUserController = new SignUpUserController(createUserUseCase);

const updateUserProfileUseCase = new UpdateUserProfileUseCase(
  userRepository,
  cloudinaryService
);
export const googleAuthController = new GoogleAuthController(googleAuthUseCase);

export const updateTrainerProfileController =
  new UpdateTrainerProfileController(updateTrainerProfileUseCase);

export const updateUserProfileController = new UpdateUserProfileController(
  updateUserProfileUseCase
);

export const chatController = new ChatController(
  getChatHistoryUseCase,
  getTrainerChatListUseCase,
  getUserChatListUseCase
);

export const otpController = new OtpController(otpUseCase);
export const purchaseSubscriptionController =
  new PurchaseSubscriptionController(purchaseSubscriptionUseCase);

export const cancelSubscriptionController = new CancelSubscriptionController(
  cancelSubscriptionUseCase
);
export const getUserSubscriptionController = new GetUserSubscriptionController(
  getUserSubscriptionUseCase
);

export const checkSubscriptionStatusController =
  new CheckSubscriptionStatusController(checkSubscriptionStatusUseCase);

export const getTrainerWithSubController = new GetTrainerWithSubController(
  getTrainerAndSubInfoUseCase
);

export const getApprovedTrainersController = new GetApprovedTrainersController(
  getApprovedTrainersUseCase
);

export const getVerifyTrainerController = new GetVerifyTrainerController(
  getVerifyTrainerlistUseCase
);
export const getVideoDetailsUseCase = new GetVideoDetailsUseCase(
  videoRepository
);

export const addVideoController = new AddVideoController(createVideoUseCase);
export const editVideoController = new EditVideoController(editVideoUseCase);

export const getAllVideosController = new GetAllVideosController(
  getVideoUseCase
);

export const getPublicVideosController = new GetPublicVideosController(
  getVideoUseCase
);

export const getVideoDetailsController = new GetVideoDetailsController(
  getVideoDetailsUseCase
);

export const getPublicVideoDetailscontroller =
  new GetPublicVideoDetailsController(getVideoDetailsUseCase);

export const updateVideoStatusController = new UpdateVideoStatusController(
  updateVideoPrivacyUseCase
);

const getUserTrainerslistUseCase = new GetUserTrainerslistUseCase(
  conversationRepository
);
export const getUserMyTrainersController = new GetUserMyTrainersController(
  getUserTrainerslistUseCase
);

export const addWorkoutController = new AddWorkoutController(
  createWorkoutUseCase
);

export const getWorkoutController = new GetWorkoutController(getWorkoutUseCase);
export const deleteWorkoutUseCase = new DeleteWorkoutUseCase(workoutRepository);
export const deleteWorkoutController = new DeleteWorkoutController(
  deleteWorkoutUseCase
);

export const completeWorkoutUseCase = new CompleteWorkoutUseCase(
  workoutRepository
);
export const updateWorkoutController = new UpdateWorkoutController(
  completeWorkoutUseCase
);

export const bookAppointmentController = new BookAppointmentController(
  bookAppointmentUseCase
);
export const updateAppointmentController = new UpdateAppointmentController(
  handleBookingApprovalUseCase
);

export const cancelAppointmentController = new CancelAppointmentController(
  cancelAppointmentUseCase
);

export const getBookingRequestsController = new GetBookingRequestsController(
  getAppointmentRequestUseCase
);
export const getTrainerSchedulesController = new GetTrainerSchedulesController(
  getTrainerSchedulesUseCase
);
export const getUserSchedulesController = new GetUserSchedulescontroller(
  getUserSchedulesUseCase
);

export const userDashBoardController = new UserDashboardController(
  userDashBoardUseCase
);

export const addPlaylistController = new CreatePlaylistController(
  createPlayListUseCase
);

export const editPlaylistController = new EditPlaylistController(
  editPlayListUseCase
);

export const getPlaylistController = new GetPlaylistController(
  getPlayListUseCase
);

export const getAllPlaylistController = new GetAllPlaylistController(
  getallPlaylistUseCase
);

export const getAllPublicPlaylistController =
  new GetAllPublicPlaylistController(getallPlaylistUseCase);

export const updatePlaylistPrivacyController =
  new UpdatePlaylistPrivacyController(updatePlayListPrivacyUseCase);

export const getPendingSlotsController = new GetPendingSlotsController(
  getPendingSlotsUseCase
);
export const getAllPendingSlotsController = new GetAllPendingSlotsController(
  getAllPendingSlotsUseCase
);
export const getUpComingSlotsController = new GetUpComingSlotsController(
  getUpComingSlotsUseCase
);

export const deleteBookingSlotController = new DeleteBookingSlotController(
  deleteBookingSlotUseCase
);

export const createBookingSlotController = new CreateBookingSlotController(
  createBookingSlotUseCase
);

export const trainerDashboardController = new TrainerDashboardController(
  trainerDashBoardUseCase
);

export const getUserVideoCallLogController = new GetUserVideoCallLogController(
  userVideoCallLogUseCase
);
export const verifySubcriptionSessionUseCase =
  new VerifySubcriptionSessionUseCase(
    userSubscriptionPlanRepository,
    stripeService
  );

export const getTrainerVideoCallLogController =
  new GetTrainerVideoCallLogController(trainerVideoCallLogUseCase);
export const subscriptionPlanController = new SubscriptionPlanController(
  createSubscriptionUseCase,
  editSubscriptionUseCase,
  deleteSubscriptionUseCase,
  subscriptionBlockUseCase
);

export const changePasswordUseCase = new ChangePasswordUseCase(
  userRepository,
  encryptionService
);

export const forgotPasswordUseCase = new ForgotPasswordUseCase(
  userRepository,
  passwordResetRepository,
  encryptionService,
  hashService
);
export const sendPasswordRestLinkUseCase = new SendPasswordRestLinkUseCase(
  userRepository,
  passwordResetRepository,
  emailService,
  hashService
);

export const getTrainerSubscribersController =
  new GetTrainerSubscribersController(getTrainerSubscribersUseCase);

export const getTrainerSubscriptionController =
  new GetTrainerSubscriptionController(getTrainerSubscriptionsUseCase);

export const webhookController = new WebhookController(webHookHandlerUseCase);

export const verifySubscriptionController = new VerifySubscriptionController(
  verifySubcriptionSessionUseCase
);

export const changePasswordController = new ChangePasswordController(
  changePasswordUseCase
);

export const passwordResetLinkController = new PasswordResetLinkController(
  sendPasswordRestLinkUseCase
);

export const forgotPasswordController = new ForgotPasswordController(
  forgotPasswordUseCase
);
