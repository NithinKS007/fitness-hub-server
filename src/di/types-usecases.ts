export const TYPES_APPOINTMENT_USECASES = {
  BookAppointmentUseCase: Symbol.for("BookAppointmentUseCase"),
  CancelAppointmentUseCase: Symbol.for("CancelAppointmentUseCase"),
  GetAppointmentRequestUseCase: Symbol.for("GetAppointmentRequestUseCase"),
  GetAppointmentByIdUseCase: Symbol.for("GetAppointmentByIdUseCase"),
  GetTrainerSchedulesUseCase: Symbol.for("GetTrainerSchedulesUseCase"),
  GetUserSchedulesUseCase: Symbol.for("GetUserSchedulesUseCase"),
  HandleBookingApprovalUseCase: Symbol.for("HandleBookingApprovalUseCase"),
};

export const TYPES_AUTH_USECASES = {
  ChangePasswordUseCase: Symbol.for("ChangePasswordUseCase"),
  CheckUserBlockStatusUseCase: Symbol.for("CheckUserBlockStatusUseCase"),
  CreateTrainerUseCase: Symbol.for("CreateTrainerUseCase"),
  CreateUserUseCase: Symbol.for("CreateUserUseCase"),
  ForgotPasswordUseCase: Symbol.for("ForgotPasswordUseCase"),
  GoogleAuthUseCase: Symbol.for("GoogleAuthUseCase"),
  OtpUseCase: Symbol.for("OtpUseCase"),
  SendPasswordRestLinkUseCase: Symbol.for("SendPasswordRestLinkUseCase"),
  SigninUserUseCase: Symbol.for("SigninUserUseCase"),
  TokenUseCase: Symbol.for("TokenUseCase"),
  UpdateTrainerProfileUseCase: Symbol.for("UpdateTrainerProfileUseCase"),
  UpdateUserProfileUseCase: Symbol.for("UpdateUserProfileUseCase"),
};

export const TYPES_BOOKINGSLOT_USECASAES = {
  CreateBookingSlotUseCase: Symbol.for("CreateBookingSlotUseCase"),
  DeleteBookingSlotUseCase: Symbol.for("DeleteBookingSlotUseCase"),
  GetAllPendingSlotsUseCase: Symbol.for("GetAllPendingSlotsUseCase"),
  GetPendingSlotsUseCase: Symbol.for("GetPendingSlotsUseCase"),
  GetUpComingSlotsUseCase: Symbol.for("GetUpComingSlotsUseCase"),
};

export const TYPES_CHAT_USECASES = {
  CreateMessageUseCase: Symbol.for("CreateMessageUseCase"),
  GetChatHistoryUseCase: Symbol.for("GetChatHistoryUseCase"),
  GetTrainerChatListUseCase: Symbol.for("GetTrainerChatListUseCase"),
  GetUserChatListUseCase: Symbol.for("GetUserChatListUseCase"),
  IncrementUnReadMessageCountUseCase: Symbol.for(
    "IncrementUnReadMessageCountUseCase"
  ),
  MarkMessageAsReadUseCase: Symbol.for("GetUserChatListUseCase"),
  UpdateLastMessageUseCase: Symbol.for("UpdateLastMessageUseCase"),
  UpdateUnReadMessageCountUseCase1: Symbol.for(
    "UpdateUnReadMessageCountUseCase"
  ),
};

export const TYPES_DASHBOARD_USECASES = {
  AdminDashBoardUseCase: Symbol.for("AdminDashBoardUseCase"),
  TrainerDashBoardUseCase: Symbol.for("TrainerDashBoardUseCase"),
  UserDashBoardUseCase: Symbol.for("UserDashBoardUseCase"),
};

export const TYPES_PLATFORM_USECASES = {
  GetPlatformEarningsUsecase: Symbol.for("GetPlatformEarningsUsecase"),
};

export const TYPES_PLAYLIST_USECASES = {
  CreatePlayListUseCase: Symbol.for("CreatePlayListUseCase"),
  EditPlayListUseCase: Symbol.for("EditPlayListUseCase"),
  GetallPlaylistUseCase: Symbol.for("GetallPlaylistUseCase"),
  GetPlayListUseCase: Symbol.for("GetPlayListUseCase"),
  UpdatePlayListPrivacyUseCase: Symbol.for("UpdatePlayListPrivacyUseCase"),
};

export const TYPES_SUBSCRIPTION__USECASES = {
  SubscriptionBlockUseCase: Symbol.for("SubscriptionBlockUseCase"),
  CancelSubscriptionUseCase: Symbol.for("CancelSubscriptionUseCase"),
  CheckSubscriptionStatusUseCase: Symbol.for("CheckSubscriptionStatusUseCase"),
  CreateSubscriptionUseCase: Symbol.for("CreateSubscriptionUseCase"),
  DeleteSubscriptionUseCase: Symbol.for("DeleteSubscriptionUseCase"),
  EditSubscriptionUseCase: Symbol.for("EditSubscriptionUseCase"),
  GetTrainerSubscribersUseCase: Symbol.for("GetTrainerSubscribersUseCase"),
  GetTrainerSubscriptionsUseCase: Symbol.for("GetTrainerSubscriptionsUseCase"),
  GetUserSubscriptionUseCase: Symbol.for("GetUserSubscriptionUseCase"),
  GetUserTrainerslistUseCase: Symbol.for("GetUserTrainerslistUseCase"),
  PurchaseSubscriptionUseCase: Symbol.for("PurchaseSubscriptionUseCase"),
  VerifySubcriptionSessionUseCase: Symbol.for(
    "VerifySubcriptionSessionUseCase"
  ),
  WebHookHandlerUseCase: Symbol.for("WebHookHandlerUseCase"),
};

export const TYPES_TRAINER_USECASES = {
  GetApprovedTrainersUseCase: Symbol.for("GetApprovedTrainersUseCase"),
  GetTrainerDetailsUseCase: Symbol.for("GetTrainerDetailsUseCase"),
  GetTrainerAndSubInfoUseCase: Symbol.for("GetTrainerAndSubInfoUseCase"),
  GetTrainersUseCase: Symbol.for("GetTrainersUseCase"),
  GetVerifyTrainerlistUseCase: Symbol.for("GetVerifyTrainerlistUseCase"),
  TrainerApprovalUseCase: Symbol.for("TrainerApprovalUseCase"),
};

export const TYPES_USER_USECASES = {
  GetUserDetailsUseCase: Symbol.for("GetUserDetailsUseCase"),
  GetUsersUseCase: Symbol.for("GetUsersUseCase"),
  UpdateUserBlockStatusUseCase: Symbol.for("UpdateUserBlockStatusUseCase"),
};

export const TYPES_VIDEO_USECASES = {
  CreateVideoUseCase: Symbol.for("CreateVideoUseCase"),
  EditVideoUseCase: Symbol.for("EditVideoUseCase"),
  GetVideoDetailsUseCase: Symbol.for("GetVideoDetailsUseCase"),
  GetVideosUseCase: Symbol.for("GetVideosUseCase"),
  UpdateVideoPrivacyUseCase: Symbol.for("UpdateVideoPrivacyUseCase"),
};

export const TYPES_VIDEO_CALL_LOG_USECASES = {
  CreateVideoCallLogUseCase: Symbol.for("CreateVideoCallLogUseCase"),
  UpdateVideoCallDurationUseCase: Symbol.for("UpdateVideoCallDurationUseCase"),
  UpdateVideoCallStatusUseCase: Symbol.for("UpdateVideoCallStatusUseCase"),
  GetTrainerVideoCallLogUseCase: Symbol.for("GetTrainerVideoCallLogUseCase"),
  GetUserVideoCallLogUseCase: Symbol.for("GetUserVideoCallLogUseCase"),
};

export const TYPES_WORKOUT_USECASES = {
  CompleteWorkoutUseCase: Symbol.for("CompleteWorkoutUseCase"),
  CreateWorkoutUseCase: Symbol.for("CreateWorkoutUseCase"),
  DeleteWorkoutUseCase: Symbol.for("DeleteWorkoutUseCase"),
  GetWorkoutUseCase: Symbol.for("GetWorkoutUseCase"),
};
