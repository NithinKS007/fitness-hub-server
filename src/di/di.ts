import { UserUseCase } from "../application/usecases/user/userUseCase";
import { TrainerGetUseCase } from "../application/usecases/trainer/trainerGetUseCase";
import { MongoUserRepository } from "../infrastructure/databases/repositories/userRepository";
import { MongoTrainerRepository } from "../infrastructure/databases/repositories/trainerRepository";
import { MongoSubscriptionRepository } from "../infrastructure/databases/repositories/subscriptionRepository";
import { MongoUserSubscriptionPlanRepository } from "../infrastructure/databases/repositories/userSubscriptionRepository";
import { MongoRevenueRepository } from "../infrastructure/databases/repositories/revenueRepository";
import { RevenueUseCase } from "../application/usecases/revenue/revenueUseCase";
import { StripePaymentService } from "../infrastructure/services/payments/stripeServices";
import { GetTrainerSubscriptionUseCase } from "../application/usecases/subscription/getTrainerSubscriptionUseCase";
import { TrainerApprovalUseCase } from "../application/usecases/trainer/trainerApprovalUseCase";
import { AdminDashBoardUseCase } from "../application/usecases/dashboard/adminDashBoardUseCase";
import { CreateUserUseCase } from "../application/usecases/auth/createUserUseCase";
import { SigninUserUseCase } from "../application/usecases/auth/signInUserUseCase";
import { OtpUseCase } from "../application/usecases/auth/otpUseCase";
import { PasswordUseCase } from "../application/usecases/auth/passwordUseCase";
import { GoogleAuthUseCase } from "../application/usecases/auth/googleAuthUseCase";
import { CreateTrainerUseCase } from "../application/usecases/auth/createTrainerUseCase";
import { UpdateProfileUseCase } from "../application/usecases/auth/updateProfileUseCase";
import { MonogPasswordResetRepository } from "../infrastructure/databases/repositories/passwordResetRepository";
import { MongoOtpRepository } from "../infrastructure/databases/repositories/otpRepository";
import { JwtService } from "../infrastructure/services/auth/jwtService";
import { TokenUseCase } from "../application/usecases/auth/tokenUseCase";
import { CloudinaryService } from "../infrastructure/services/storage/cloudinaryService";
import { GoogleAuthService } from "../infrastructure/services/auth/googleAuthService";
import { EmailService } from "../infrastructure/services/communication/emailService";
import { AdminController } from "../presentation/controllers/admin/adminController";
import { AdminDashboardController } from "../presentation/controllers/dashboard/adminDashBoardController";
import { AuthController } from "../presentation/controllers/auth/authController";
import { ChatUseCase } from "../application/usecases/chat/chatUseCase";
import { MongoChatRepository } from "../infrastructure/databases/repositories/chatRepository";
import { MongoConversationRepository } from "../infrastructure/databases/repositories/conversationRepository";
import { ChatController } from "../presentation/controllers/chat/chatController";
import { GetUserSubscriptionUseCase } from "../application/usecases/subscription/getUserSubscriptionUseCase";
import { TrainerDisplayController } from "../presentation/controllers/trainer/trainerDisplayController";
import { PurchaseSubscriptionController } from "../presentation/controllers/subscription/purchaseSubscriptionController";
import { PurchaseSubscriptionUseCase } from "../application/usecases/subscription/purchaseSubscriptionUseCase";
import { CancelSubscriptionUseCase } from "../application/usecases/subscription/cancelSubscriptionUseCase";
import { UserSubscriptionController } from "../presentation/controllers/subscription/userSubscriptionController";
import { CheckSubscriptionStatusUseCase } from "../application/usecases/subscription/checkSubscriptionStatusUseCase";
import { WebhookController } from "../presentation/controllers/subscription/webhookController";
import { WebHookHandlerUseCase } from "../application/usecases/subscription/webhookHandlerUseCase";
import { MongoPlayListRepository } from "../infrastructure/databases/repositories/playListRepository";
import { MonogVideoRepository } from "../infrastructure/databases/repositories/videoRepository";
import { MonogVideoPlayListRepository } from "../infrastructure/databases/repositories/videoPlayList";
import { EditVideoUseCase } from "../application/usecases/video/editVideoUseCase";
import { CreateVideoUseCase } from "../application/usecases/video/createVideoUseCase";
import { UpdateVideoPrivacyUseCase } from "../application/usecases/video/updateVideoPrivacyUseCase";
import { GetVideoUseCase } from "../application/usecases/video/getVideoUseCase";
import { VideoController } from "../presentation/controllers/video/videoController";
import { WorkoutController } from "../presentation/controllers/workout/workOutController";
import { MongoWorkoutRepository } from "../infrastructure/databases/repositories/workoutRepository";
import { CreateWorkoutUseCase } from "../application/usecases/workout/createWorkoutUseCase";
import { GetWorkoutUseCase } from "../application/usecases/workout/getWorkoutUseCase";
import { UpdateWorkoutUseCase } from "../application/usecases/workout/updateWorkoutUseCase";
import { MongoBookingSlotRepository } from "../infrastructure/databases/repositories/bookingSlotRepository";
import { MongoAppointmentRepository } from "../infrastructure/databases/repositories/appointmentRepository";
import { BookAppointmentUseCase } from "../application/usecases/appointment/bookAppointmentUseCaste";
import { UpdateAppointmentUseCase } from "../application/usecases/appointment/updateAppointmentUseCase";
import { GetAppointmentUsecase } from "../application/usecases/appointment/getAppointmentUseCase";
import { AppointmentController } from "../presentation/controllers/appointment/appointmentController";
import { UserDashBoardUseCase } from "../application/usecases/dashboard/userDashBoardUseCase";
import { UserDashboardController } from "../presentation/controllers/dashboard/userDashBoardController";
import { CreatePlayListUseCase } from "../application/usecases/playlist/createPlayListUseCase";
import { EditPlayListUseCase } from "../application/usecases/playlist/editPlayListUseCase";
import { GetallPlaylistUseCase } from "../application/usecases/playlist/getAllPlayListUseCase";
import { GetPlayListUseCase } from "../application/usecases/playlist/getPlayListUseCase";
import { UpdatePlayListPrivacyUseCase } from "../application/usecases/playlist/updatePlayListPrivacyUseCase";
import { PlayListController } from "../presentation/controllers/playlist/playListController";
import { GetBookingSlotUseCase } from "../application/usecases/bookingSlot/getBookingSlotUseCase";
import { DeleteBookingSlotUseCase } from "../application/usecases/bookingSlot/deleteBookingSlotUseCase";
import { CreateBookingSlotUseCase } from "../application/usecases/bookingSlot/createBookingSlotUseCase";
import { BookingController } from "../presentation/controllers/booking/bookingController";
import { TrainerDashBoardUseCase } from "../application/usecases/dashboard/trainerDashBoardUseCase";
import { TrainerDashboardController } from "../presentation/controllers/dashboard/trainerDashBoardController";
import { MongoVideoCallLogRepository } from "../infrastructure/databases/repositories/videoCallLogRepository";
import { TrainerVideoCallLogUseCase } from "../application/usecases/videoCallLog/trainerVideoCallLogUseCase";
import { UserVideoCallLogUseCase } from "../application/usecases/videoCallLog/userVideoCallLogUseCase";
import { VideoCallLogController } from "../presentation/controllers/videoCallLog/videoCallLogController";
import { CreateSubscriptionUseCase } from "../application/usecases/subscription/createSubscriptionUseCase";
import { EditSubscriptionUseCase } from "../application/usecases/subscription/editSubscriptionUseCase";
import { DeleteSubscriptionUseCase } from "../application/usecases/subscription/deleteSubscriptionUseCase";
import { SubscriptionBlockUseCase } from "../application/usecases/subscription/blockSubscriptionUseCase";
import { SubscriptionPlanController } from "../presentation/controllers/subscription/subscriptionPlanController";
import { TrainerSubscriptionController } from "../presentation/controllers/subscription/trainerSubscriptionController";

//SERVICE INSTANCES
const cloudinaryService = new CloudinaryService();
const jwtService = new JwtService();
const emailService = new EmailService();
const googleAuthService = new GoogleAuthService();

//MONGO REPOSITORY INSTANCES
const mongouserRepository = new MongoUserRepository();
const mongoTrainerRepository = new MongoTrainerRepository();
const mongoSubscriptionRepository = new MongoSubscriptionRepository();
const monogUserSubscriptionPlanRepository =
  new MongoUserSubscriptionPlanRepository();
const mongoRevenueRepository = new MongoRevenueRepository();
const mongoUserSubscriptionRepository =
  new MongoUserSubscriptionPlanRepository();
const mongoUserRepository = new MongoUserRepository();
const mongoOtpRepository = new MongoOtpRepository();
const monogPasswordResetRepository = new MonogPasswordResetRepository();
const mongoChatRepository = new MongoChatRepository();
const mongoConversationRepository = new MongoConversationRepository();
const mongoPlayListRepository = new MongoPlayListRepository();
const mongoVideoRepository = new MonogVideoRepository();
const mongoVideoPlayListRepository = new MonogVideoPlayListRepository();
const mongoWorkoutRepository = new MongoWorkoutRepository();
const mongoBookingSlotRepository = new MongoBookingSlotRepository();
const mongoAppointmentRepository = new MongoAppointmentRepository();
const mongoVideoCallLogRepository = new MongoVideoCallLogRepository();

//USE CASE INSTANCES
const userUseCase = new UserUseCase(mongouserRepository);
const trainerGetUseCase = new TrainerGetUseCase(mongoTrainerRepository);
const revenueUseCase = new RevenueUseCase(mongoRevenueRepository);
const stripeService = new StripePaymentService();

const getTrainerSubscriptionUseCase = new GetTrainerSubscriptionUseCase(
  mongoSubscriptionRepository,
  monogUserSubscriptionPlanRepository,
  stripeService
);
const trainerApprovalUseCase = new TrainerApprovalUseCase(
  mongoTrainerRepository
);
const adminDashBoardUseCase = new AdminDashBoardUseCase(
  mongoUserSubscriptionRepository,
  mongoUserRepository,
  mongoTrainerRepository,
  mongoRevenueRepository
);

const createUserUseCase = new CreateUserUseCase(
  mongoUserRepository,
  mongoOtpRepository,
  emailService
);
const signinUseCase = new SigninUserUseCase(
  mongoUserRepository,
  mongoTrainerRepository,
  jwtService
);
const otpUseCase = new OtpUseCase(
  mongoOtpRepository,
  mongoUserRepository,
  emailService
);
const passwordUseCase = new PasswordUseCase(
  mongoUserRepository,
  monogPasswordResetRepository,
  emailService
);

const googleAuthUseCase = new GoogleAuthUseCase(
  mongoUserRepository,
  jwtService,
  googleAuthService
);
const profileUseCase = new UpdateProfileUseCase(
  mongoUserRepository,
  mongoTrainerRepository,
  cloudinaryService
);
const createTrainerUseCase = new CreateTrainerUseCase(
  mongoUserRepository,
  mongoOtpRepository,
  mongoTrainerRepository,
  emailService
);
const refreshAccessTokenUseCase = new TokenUseCase(jwtService);
const chatUseCase = new ChatUseCase(
  mongoChatRepository,
  mongoConversationRepository
);

const getUserSubscriptionUseCase = new GetUserSubscriptionUseCase(
  monogUserSubscriptionPlanRepository,
  stripeService
);

const purchaseSubscriptionUseCase = new PurchaseSubscriptionUseCase(
  mongoSubscriptionRepository,
  monogUserSubscriptionPlanRepository,
  stripeService
);
const cancelSubscriptionUseCase = new CancelSubscriptionUseCase(stripeService);

const checkSubscriptionStatusUseCase = new CheckSubscriptionStatusUseCase(
  monogUserSubscriptionPlanRepository,
  stripeService
);
const webHookHandlerUseCase = new WebHookHandlerUseCase(
  mongoSubscriptionRepository,
  monogUserSubscriptionPlanRepository,
  mongoRevenueRepository,
  mongoConversationRepository,
  stripeService,
  emailService,
  mongoUserRepository
);

const editVideoUseCase = new EditVideoUseCase(
  mongoPlayListRepository,
  mongoVideoRepository,
  mongoVideoPlayListRepository
);

const createVideoUseCase = new CreateVideoUseCase(
  mongoPlayListRepository,
  mongoVideoRepository,
  mongoVideoPlayListRepository
);

const updateVideoPrivacyUseCase = new UpdateVideoPrivacyUseCase(
  mongoVideoRepository
);
const getVideoUseCase = new GetVideoUseCase(mongoVideoRepository);
const createWorkoutUseCase = new CreateWorkoutUseCase(mongoWorkoutRepository);
const getWorkoutUseCase = new GetWorkoutUseCase(mongoWorkoutRepository);
const updateWorkoutUseCase = new UpdateWorkoutUseCase(mongoWorkoutRepository);
const bookAppointmentUseCase = new BookAppointmentUseCase(
  mongoBookingSlotRepository,
  mongoAppointmentRepository
);

const updateAppointmentUseCase = new UpdateAppointmentUseCase(
  mongoBookingSlotRepository,
  mongoAppointmentRepository
);

const getAppointmentUseCase = new GetAppointmentUsecase(
  mongoAppointmentRepository
);

const userDashBoardUseCase = new UserDashBoardUseCase(mongoWorkoutRepository);

const createPlayListUseCase = new CreatePlayListUseCase(
  mongoPlayListRepository
);

const editPlayListUseCase = new EditPlayListUseCase(mongoPlayListRepository);
const getallPlaylistUseCase = new GetallPlaylistUseCase(
  mongoPlayListRepository
);
const getPlayListUseCase = new GetPlayListUseCase(mongoPlayListRepository);
const updatePlayListPrivacyUseCase = new UpdatePlayListPrivacyUseCase(
  mongoPlayListRepository
);
const createBookingSlotUseCase = new CreateBookingSlotUseCase(
  mongoBookingSlotRepository
);
const deleteBookingSlotUseCase = new DeleteBookingSlotUseCase(
  mongoBookingSlotRepository
);
const getBookingSlotUseCase = new GetBookingSlotUseCase(
  mongoBookingSlotRepository
);
const trainerDashBoardUseCase = new TrainerDashBoardUseCase(
  mongoUserSubscriptionRepository
);
const trainerVideoCallLogUseCase = new TrainerVideoCallLogUseCase(
  mongoVideoCallLogRepository
);
const userVideoCallLogUseCase = new UserVideoCallLogUseCase(
  mongoVideoCallLogRepository
);

const createSubscriptionUseCase = new CreateSubscriptionUseCase(
  mongoSubscriptionRepository,
  mongoTrainerRepository,
  stripeService
);

const editSubscriptionUseCase = new EditSubscriptionUseCase(
  mongoSubscriptionRepository,
  mongoTrainerRepository,
  stripeService
);

const deleteSubscriptionUseCase = new DeleteSubscriptionUseCase(
  mongoSubscriptionRepository,
  stripeService
);

const subscriptionBlockUseCase = new SubscriptionBlockUseCase(
  mongoSubscriptionRepository
);
//controller instances
export const adminController = new AdminController(
  userUseCase,
  trainerGetUseCase,
  revenueUseCase,
  getTrainerSubscriptionUseCase,
  trainerApprovalUseCase
);

export const adminDashboardController = new AdminDashboardController(
  adminDashBoardUseCase
);
export const authController = new AuthController(
  createUserUseCase,
  signinUseCase,
  otpUseCase,
  passwordUseCase,
  googleAuthUseCase,
  profileUseCase,
  createTrainerUseCase,
  refreshAccessTokenUseCase
);

export const chatController = new ChatController(chatUseCase);

export const trainerDisplayController = new TrainerDisplayController(
  trainerGetUseCase,
  getUserSubscriptionUseCase
);
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

export const videoController = new VideoController(
  createVideoUseCase,
  editVideoUseCase,
  updateVideoPrivacyUseCase,
  getVideoUseCase
);

export const workoutController = new WorkoutController(
  createWorkoutUseCase,
  getWorkoutUseCase,
  updateWorkoutUseCase
);

export const appointmentController = new AppointmentController(
  bookAppointmentUseCase,
  updateAppointmentUseCase,
  getAppointmentUseCase
);

export const userDashBoardController = new UserDashboardController(
  userDashBoardUseCase
);

export const playListController = new PlayListController(
  createPlayListUseCase,
  editPlayListUseCase,
  getallPlaylistUseCase,
  getPlayListUseCase,
  updatePlayListPrivacyUseCase
);

export const bookingController = new BookingController(
  createBookingSlotUseCase,
  deleteBookingSlotUseCase,
  getBookingSlotUseCase
);

export const trainerDashboardController = new TrainerDashboardController(
  trainerDashBoardUseCase
);

export const videoCallLogController = new VideoCallLogController(
  trainerVideoCallLogUseCase,
  userVideoCallLogUseCase
);

export const subscriptionPlanController = new SubscriptionPlanController(
  createSubscriptionUseCase,
  editSubscriptionUseCase,
  deleteSubscriptionUseCase,
  subscriptionBlockUseCase
);

export const trainerSubscriptionController = new TrainerSubscriptionController(
  getTrainerSubscriptionUseCase
);
