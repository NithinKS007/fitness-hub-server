import { UserUseCase } from "../application/usecases/user/user.usecase";
import { TrainerGetUseCase } from "../application/usecases/trainer/get-trainer.usecase";
import { UserRepository } from "../infrastructure/databases/repositories/user.repository";
import { TrainerRepository } from "../infrastructure/databases/repositories/trainer.repository";
import { SubscriptionRepository } from "../infrastructure/databases/repositories/subscription.repository";
import { UserSubscriptionPlanRepository } from "../infrastructure/databases/repositories/user-subscription-plan.repository";
import { RevenueRepository } from "../infrastructure/databases/repositories/revenue.repository";
import { GetPlatformEarningsUsecase } from "../application/usecases/platform/get-platfrom-earnings.usecase";
import { StripePaymentService } from "../infrastructure/services/payments/stripe.service";
import { GetTrainerSubscriptionsUseCase } from "../application/usecases/subscription/get-trainer-subscriptions.usecase";
import { TrainerApprovalUseCase } from "../application/usecases/trainer/trainer-approval.usecase";
import { AdminDashBoardUseCase } from "../application/usecases/dashboard/admin-dashboard.usecase";
import { CreateUserUseCase } from "../application/usecases/auth/create-user.usecase";
import { SigninUserUseCase } from "../application/usecases/auth/signin-user.usecase";
import { OtpUseCase } from "../application/usecases/auth/otp.usecase";
import { PasswordUseCase } from "../application/usecases/auth/password.usecase";
import { GoogleAuthUseCase } from "../application/usecases/auth/google-auth.usecase";
import { CreateTrainerUseCase } from "../application/usecases/auth/create-trainer.usecase";
import { UpdateTrainerProfileUseCase } from "../application/usecases/auth/update-trainer-profile.usecase";
import { PasswordResetRepository } from "../infrastructure/databases/repositories/passwordreset.repository";
import { OtpRepository } from "../infrastructure/databases/repositories/otp.repository";
import { JwtService } from "../infrastructure/services/auth/jwt.service";
import { TokenUseCase } from "../application/usecases/auth/token.usecase";
import { CloudinaryService } from "../infrastructure/services/storage/cloudinary.service";
import { GoogleAuthService } from "../infrastructure/services/auth/google.auth.service";
import { EmailService } from "../infrastructure/services/communication/email.service";
import { AdminDashboardController } from "../presentation/controllers/dashboard/admin-dashboard.controller";
import { UserSessionController } from "../presentation/controllers/auth/user-session.controller";
import { ChatRepository } from "../infrastructure/databases/repositories/chat.repository";
import { ConversationRepository } from "../infrastructure/databases/repositories/conversation.repository";
import { ChatController } from "../presentation/controllers/chat/chat.controller";
import { GetUserSubscriptionUseCase } from "../application/usecases/subscription/get-user-subscription.usecase";
import { GetApprovedTrainersController } from "../presentation/controllers/trainer/get-approved-trainers.controller";
import { PurchaseSubscriptionController } from "../presentation/controllers/subscription/purchase-subscription.controller";
import { PurchaseSubscriptionUseCase } from "../application/usecases/subscription/purchase-subscription.usecase";
import { CancelSubscriptionUseCase } from "../application/usecases/subscription/cancel-subscription.usecase";
import { UserSubscriptionController } from "../presentation/controllers/subscription/user-subscription.controller";
import { CheckSubscriptionStatusUseCase } from "../application/usecases/subscription/check-subscription-status.usecase";
import { WebhookController } from "../presentation/controllers/subscription/webhook.controller";
import { WebHookHandlerUseCase } from "../application/usecases/subscription/webhook-handler.usecase";
import { PlayListRepository } from "../infrastructure/databases/repositories/playlist.repository";
import { VideoRepository } from "../infrastructure/databases/repositories/video.repository";
import { VideoPlayListRepository } from "../infrastructure/databases/repositories/video-playlist.repository";
import { EditVideoUseCase } from "../application/usecases/video/edit-video.usecase";
import { CreateVideoUseCase } from "../application/usecases/video/create-video.usecase";
import { UpdateVideoPrivacyUseCase } from "../application/usecases/video/update-video.privacy.usecase";
import { GetVideoUseCase } from "../application/usecases/video/get-video.usecase";
import { WorkoutRepository } from "../infrastructure/databases/repositories/workout.repository";
import { CreateWorkoutUseCase } from "../application/usecases/workout/create-workout.usecase";
import { GetWorkoutUseCase } from "../application/usecases/workout/get-workout.usecase";
import { BookingSlotRepository } from "../infrastructure/databases/repositories/bookingslot.repository";
import { AppointmentRepository } from "../infrastructure/databases/repositories/appointment.repository";
import { BookAppointmentUseCase } from "../application/usecases/appointment/book-appointment-usecase";
import { BookAppointmentController } from "../presentation/controllers/appointment/book-appointment.controller";
import { UserDashBoardUseCase } from "../application/usecases/dashboard/user-dashboard.usecase";
import { UserDashboardController } from "../presentation/controllers/dashboard/user-dashboard.controller";
import { CreatePlayListUseCase } from "../application/usecases/playlist/create-playlist.usecase";
import { EditPlayListUseCase } from "../application/usecases/playlist/edit-playlist.usecase";
import { GetallPlaylistUseCase } from "../application/usecases/playlist/get-all-playlist.usecase";
import { GetPlayListUseCase } from "../application/usecases/playlist/get-playlist.usecase";
import { UpdatePlayListPrivacyUseCase } from "../application/usecases/playlist/update-playlist-privacy.usecase";
import { DeleteBookingSlotUseCase } from "../application/usecases/bookingSlot/delete-booking-slot.usecase";
import { CreateBookingSlotUseCase } from "../application/usecases/bookingSlot/create-booking-slot.usecase";
import { TrainerDashBoardUseCase } from "../application/usecases/dashboard/trainer-dashboard.usecase";
import { TrainerDashboardController } from "../presentation/controllers/dashboard/trainer-dashboard.controller";
import { VideoCallLogRepository } from "../infrastructure/databases/repositories/video-calllog.repository";
import { GetTrainerVideoCallLogUseCase } from "../application/usecases/videoCallLog/get-trainer-video-calllog.usecase";
import { GetUserVideoCallLogUseCase } from "../application/usecases/videoCallLog/get-user-video-calllog.usecase";
import { CreateSubscriptionUseCase } from "../application/usecases/subscription/create-subscription.usecase";
import { EditSubscriptionUseCase } from "../application/usecases/subscription/edit-subscription.usecase";
import { DeleteSubscriptionUseCase } from "../application/usecases/subscription/delete-subscription.usecase";
import { SubscriptionBlockUseCase } from "../application/usecases/subscription/block-subscription.usecase";
import { SubscriptionPlanController } from "../presentation/controllers/subscription/subscription-plan.controller";
import { TrainerSubscriptionController } from "../presentation/controllers/subscription/trainer-subscription.controller";
import { UpdateAppointmentController } from "../presentation/controllers/appointment/update-appointment.controller";
import { GetAppointmentController } from "../presentation/controllers/appointment/get-appointment.controller";
import { ProfileController } from "../presentation/controllers/auth/profile.controller";
import { PasswordController } from "../presentation/controllers/auth/password.controller";
import { OtpController } from "../presentation/controllers/auth/otp.controller";
import { GoogleAuthController } from "../presentation/controllers/auth/google-auth.controller";
import { CreateController } from "../presentation/controllers/auth/create.controller";
import { AddVideoController } from "../presentation/controllers/video/add-video.controller";
import { EditVideoController } from "../presentation/controllers/video/edit-video.controller";
import { GetVideoController } from "../presentation/controllers/video/get-video.controller";
import { UpdateVideoStatusController } from "../presentation/controllers/video/update-video-status.controller";
import { GetUserVideoCallLogController } from "../presentation/controllers/videoCallLog/user-calllogs.controller";
import { GetTrainerVideoCallLogController } from "../presentation/controllers/videoCallLog/trainer-calllogs.controller";
import { GetBookingSlotController } from "../presentation/controllers/booking/get-booking.controller";
import { DeleteBookingSlotController } from "../presentation/controllers/booking/deleting-booking.controller";
import { CreateBookingSlotController } from "../presentation/controllers/booking/create-booking.controller";
import { OTPService } from "../infrastructure/services/security/otp.service";
import { PasswordService } from "../infrastructure/services/security/password.service";
import { TokenService } from "../infrastructure/services/security/token.service";
import { CreatePlaylistController } from "../presentation/controllers/playlist/create-playlist.controller";
import { EditPlaylistController } from "../presentation/controllers/playlist/edit-playlist.controller";
import { GetPlaylistController } from "../presentation/controllers/playlist/get-playlist.controller";
import { UpdatePlaylistcontroller } from "../presentation/controllers/playlist/update-playlist-status.controller";
import { GetPlatformEarningsController } from "../presentation/controllers/platform/get-platform-earnings.controller";
import { VerifyTrainerController } from "../presentation/controllers/trainer/verify-trainer.controller";
import { GetUserController } from "../presentation/controllers/user/get-user.controller";
import { UpdateUserBlockStatusController } from "../presentation/controllers/user/update-user-block-status.controller";
import { GetVerifyTrainerController } from "../presentation/controllers/trainer/get-verify-trainer.controller";
import { GetUserMyTrainersController } from "../presentation/controllers/trainer/get-user-my-trainerslist.controller";
import { GetTrainerWithSubController } from "../presentation/controllers/trainer/get-trainer-with-sub.controller";
import { GetallTrainersController } from "../presentation/controllers/trainer/get-all-trainers.controller";
import { GetTrainerDetailsController } from "../presentation/controllers/trainer/get-trainer-details.controller";
import { AddWorkoutController } from "../presentation/controllers/workout/add-workout.controller";
import { GetWorkoutController } from "../presentation/controllers/workout/get-workout.controller";
import { DeleteWorkoutController } from "../presentation/controllers/workout/delete-workout.controller";
import { UpdateWorkoutController } from "../presentation/controllers/workout/update-workout.controller";
import { DateService } from "../infrastructure/services/date/date.service";
import { GetAppointmentRequestUseCase } from "../application/usecases/appointment/get-appointment-req.usecase";
import { CancelAppointmentUseCase } from "../application/usecases/appointment/cancel-appointment.usecase";
import { HandleBookingApprovalUseCase } from "../application/usecases/appointment/handle-booking.usecase";
import { GetTrainerSchedulesUseCase } from "../application/usecases/appointment/get-trainer-schedules";
import { GetUserSchedulesUseCase } from "../application/usecases/appointment/get-user-schedules";
import { UpdateUserProfileUseCase } from "../application/usecases/auth/update-user-profile.usecase";
import { GetTrainerSubscribersUseCase } from "../application/usecases/subscription/get-trainer-subscribed-users.usecase";
import { DeleteWorkoutUseCase } from "../application/usecases/workout/delete-workout-usecase";
import { CompleteWorkoutUseCase } from "../application/usecases/workout/complete-workout.usecase";
import { GetPendingSlotsUseCase } from "../application/usecases/bookingSlot/get-pending-slots";
import { GetAllPendingSlotsUseCase } from "../application/usecases/bookingSlot/get-all-pending-slots";
import { GetUpComingSlotsUseCase } from "../application/usecases/bookingSlot/get-upcoming-slots";
import { GetChatHistoryUseCase } from "../application/usecases/chat/get-chat-history.usecase";
import { GetTrainerChatListUseCase } from "../application/usecases/chat/get-trainer-chat-list.usecase";
import { GetUserChatListUseCase } from "../application/usecases/chat/get-user-chat-list.usecase";

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
const userUseCase = new UserUseCase(userRepository);
const trainerGetUseCase = new TrainerGetUseCase(trainerRepository);
const stripeService = new StripePaymentService();
const otpService = new OTPService();
const passwordService = new PasswordService();
const tokenService = new TokenService();
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
  passwordService
);
const signinUseCase = new SigninUserUseCase(
  userRepository,
  trainerRepository,
  jwtService,
  passwordService
);
const otpUseCase = new OtpUseCase(
  otpRepository,
  userRepository,
  emailService,
  otpService
);
const passwordUseCase = new PasswordUseCase(
  userRepository,
  passwordResetRepository,
  emailService,
  passwordService,
  tokenService
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
  passwordService
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
  userSubscriptionPlanRepository,
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
const getVideoUseCase = new GetVideoUseCase(videoRepository);
const createWorkoutUseCase = new CreateWorkoutUseCase(workoutRepository);
const getWorkoutUseCase = new GetWorkoutUseCase(workoutRepository);
const bookAppointmentUseCase = new BookAppointmentUseCase(
  bookingSlotRepository,
  appointmentRepository
);

const getTrainerSchedulesUseCase = new GetTrainerSchedulesUseCase(
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
// const getBookingSlotUseCase = new GetBookingSlotUseCase(bookingSlotRepository);

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
  trainerGetUseCase
);

export const getTrainerDetailsController = new GetTrainerDetailsController(
  trainerGetUseCase
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

export const getUserController = new GetUserController(userUseCase);
export const updateUserBlockStatusController =
  new UpdateUserBlockStatusController(userUseCase);

export const adminDashboardController = new AdminDashboardController(
  adminDashBoardUseCase
);
export const userSessionController = new UserSessionController(
  signinUseCase,
  refreshAccessTokenUseCase
);
export const createController = new CreateController(
  createUserUseCase,
  createTrainerUseCase
);
const updateUserProfileUseCase = new UpdateUserProfileUseCase(
  userRepository,
  cloudinaryService
);
export const googleAuthController = new GoogleAuthController(googleAuthUseCase);
export const profileController = new ProfileController(
  updateTrainerProfileUseCase,
  updateUserProfileUseCase
);

export const passwordController = new PasswordController(passwordUseCase);
export const chatController = new ChatController(
  getChatHistoryUseCase,
  getTrainerChatListUseCase,
  getUserChatListUseCase
);

export const otpController = new OtpController(otpUseCase);
export const purchaseSubscriptionController =
  new PurchaseSubscriptionController(
    purchaseSubscriptionUseCase,
    cancelSubscriptionUseCase
  );

export const userSubscriptionController = new UserSubscriptionController(
  getUserSubscriptionUseCase,
  checkSubscriptionStatusUseCase
);
export const webhookController = new WebhookController(
  webHookHandlerUseCase,
  purchaseSubscriptionUseCase
);

export const getTrainerWithSubController = new GetTrainerWithSubController(
  trainerGetUseCase
);

export const getApprovedTrainersController = new GetApprovedTrainersController(
  trainerGetUseCase
);

export const getVerifyTrainerController = new GetVerifyTrainerController(
  trainerGetUseCase
);
export const addVideoController = new AddVideoController(createVideoUseCase);
export const editVideoController = new EditVideoController(editVideoUseCase);
export const getVideoController = new GetVideoController(getVideoUseCase);
export const updateVideoStatusController = new UpdateVideoStatusController(
  updateVideoPrivacyUseCase
);

export const getUserMyTrainersController = new GetUserMyTrainersController(
  getUserSubscriptionUseCase
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
  cancelAppointmentUseCase,
  handleBookingApprovalUseCase
);
const getAppointmentRequestUseCase = new GetAppointmentRequestUseCase(
  appointmentRepository
);

const getUserSchedulesUseCase = new GetUserSchedulesUseCase(
  appointmentRepository
);

export const getAppointmentController = new GetAppointmentController(
  getAppointmentRequestUseCase,
  getTrainerSchedulesUseCase,
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
  getallPlaylistUseCase,
  getPlayListUseCase
);

export const updatePlaylistcontroller = new UpdatePlaylistcontroller(
  updatePlayListPrivacyUseCase
);

export const getBookingSlotController = new GetBookingSlotController(
  getPendingSlotsUseCase,
  getAllPendingSlotsUseCase,
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
export const getTrainerVideoCallLogController =
  new GetTrainerVideoCallLogController(trainerVideoCallLogUseCase);
export const subscriptionPlanController = new SubscriptionPlanController(
  createSubscriptionUseCase,
  editSubscriptionUseCase,
  deleteSubscriptionUseCase,
  subscriptionBlockUseCase
);

export const trainerSubscriptionController = new TrainerSubscriptionController(
  getTrainerSubscriptionsUseCase,
  getTrainerSubscribersUseCase
);
