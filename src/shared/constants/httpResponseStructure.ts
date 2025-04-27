export enum HttpStatusCodes {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}

export enum UserStatusMessage {
  UserList = "Users list retrieved successfully",
  failedToRetrieveUsersList = "Failed to retrieve user list",
}

export enum RevenueStatusMessage {
  FailedToFetchRevenueHistory = "Failed to fetch revenue history",
  SuccessFullyFetchedRevenueHistory = "Revenue list retrieved successfully",
}

export enum ChatStatusMessage {
  FailedToUpdateLastMessage = "Failed to update last message",
  FailedtoUpdateUnReadCount = "Failed to update un read message count",
  FailedToCreateMessageInChatDatabase = "Failed to create message",
  FailedToGetChatMessages = "Failed to get messages",
  ChatSendSuccessfully = "chat history send successfully",
  FailedToRetrieveChatList = "Failed to retrieve chat list",
}

export enum WorkoutStatusMessage {
  FailedToAddWorkout = "Failed to add workout. Please try again",
  FailedToGetWorkoutData = "Failed to get workout data",
  WorkoutListRetrievedSuccessfully = "Workout list retrieved successfully",
  workoutAddedSuccessfully = "Workout added successfully",
  FailedToDeletWorkoutSet = "Failed to delete workout set",
  FailedToMarkCompletionSetStatus = "Failed to mark workout completion status",
  WorkoutSetCompleted = "Workout Completed",
  WorkoutSetDeleted = "Workout set deleted successfully",
  cannotCompleteFutureWorkouts = "You cannot mark a workout as complete before its scheduled date",
}

export enum EnvironmentVariableStatusMessage {
  MissingEmailEnvironmentVariables = "Missing required email environment variables",
  MissingCloudinaryCredentials = "Missing required cloudinary environment variables",
  MissingJwtEnvironmentVariables = "Missing required jwt environment variables",
}

export enum VideoStatusMessage {
  VideoUploadedSuccessfully = "Video uploaded successfully",
  VideoDataRetrievedSuccessfully = "Video data retrieved successfully",
  videoEditedSuccessfully = "Video edited successfully",
  FailedToEditVideo = "Failed to edit video",
  FailedToGetVideo = "Failed to get video data",
}

export enum PlayListStatusMessage {
  PlayListCreated = "Playlist added successfully",
  FailedToCreatePlayList = "Failed to create PlayList",
  PlayListsOfTrainerRetrievedSuccessfully = "Playlists of trainer retrieved successfully",
  PlayListEditedSuccessfully = "Playlist edited successfully",
}

export enum JWTStatusMessage {
  AuthenticationHeaderIsMissing = "Authentication header is missing",
  NoRefreshToken = "No refresh token",
  InvalidRefreshToken = "Invalid refresh token",
  AccessTokenRefreshedSuccessFully = "Access Token refreshed successfully",
  InvalidAccessToken = "Invalid access token",
  NoAccessToken = "No access Token",
}

export enum PasswordStatusMessage {
  FailedToHashPassword = "Failed to hash password",
  FailedToComparePassword = "Failed to compare password",
  PasswordUpdated = "Password updated successfully",
  LinkExpired = "Link expired.",
  PassWordResetSuccess = "Your password has been successfully reset. You can now log in with your new password",
  IncorrectPassword = "The password you entered is incorrect for this user.",
}

export enum OTPStatusMessage {
  OtpSendSuccessful = "The OTP has been resent to your email successfully.",
  AlreadyUserVerifiedByOtp = "This user has already been verified and cannot receive a new OTP.",
  InvalidOtp = "The OTP you entered is either invalid or has expired.",
}

export enum InternalServerErrorStatusMessage {
  InternalServerError = "An internal server error occurred. Please try again later.",
}

export enum DashboardStatusMessage {
  FailedToRetrieveCount = "Failed to get count.",
  FailedToGetUserDashBoardData = "Failed to get user dashboard data",
  FailedToGetAdminDashBoardData = "Failed to get admin dashboard data",
  FailedToGetTrainerDashBoardData = "Failed to get Trainer dashboard data",
  UserDashBoardRetrievedSuccessfully = "User dashboard retrieved successfully",
  AdminDashBoardRetrievedSuccessfully = "Admin dashboard retrieved successfully",
  TrainerDashBoardRetrievedSuccessfully = "Trainer dashboard retrieved successfully",
}

export enum VideoCallStatusMessage {
  FailedToCreateVideoCallLog = "Failed to create video call Log",
  VideoCallLogsRetrievedSuccessfully = "video call logs retrieved successfully",
  FailedToRetrieveVideoCallLogs = "Failed to retrieve video call logs",
}

export enum CloudinaryStatusMessage {
  FailedToUploadToCloudinary = "Failed to upload data to cloudinary",
}

export enum BlockStatusMessage {
  BlockStatusUpdated = "Block status Updated successfully",
  FailedToUpdateBlockStatus = "Failed to update block status",
}

export enum SubscriptionStatusMessage {
  SubscriptionCreated = "Subscription added successfully",
  SubscriptionAlreadyExists = "Cannot made changes, subscription already exists",
  SubscriptionsListRetrieved = "Subscriptions list retrieved successfully",
  SubscriptionAddedSuccessfully = "Subscription added successfully",
  FailedToRetrieveSubscriptionDetails = "Subscription not found or unavailable",
  FailedToCreateSubscriptionSession = "Failed to create subscription session",
  WebHookCredentialsMissing = "Web hook credentials are missing",
  WebHookVerificationFailed = "Webhook signature verification failed",
  SubscriptionIdAndTraineIdMissing = "Missing metadata: subscriptionId or trainerId.",
  SubscriptionListOfUserRetrievedSuccessfully = "User subscription list retrieved successfully",
  SubscriptionCancelledSuccessfully = "Your subscription has been cancelled successfully",
  InvalidSessionIdForStripe = "Invalid session id for stripe",
  SubscriptionBlockedUnavailabe = "Currently unavailable",
  FailedToCheckSubscriptionStatus = "Failed to check subscription status",
  UserIsSubscribed = "The current user is subscribed",
  SubscriptionBlockStatusUpdated = "Subscription status updated successfully",
  FailedToDeleteSubscription = "Failed to delete subscription",
  SubscriptionEditedSuccessfully = "Subscription edited successfully",
  SubscriptionDeletedSuccessfully = "Subscription deleted successfully",
  FailedToEditSubscription = "Failed to edit subscription"
}

export enum ProfileStatusMessage {
  UserDetailsUpdated = "Profile updated successfully",
  FailedToUpdateUserDetails = "Failed to update user details",
  UserDataRetrieved = "User Details retrieved successfully",
  FailedToRetrieveUserDetails = "Failed to retrieve user details",
}

export enum AuthenticationStatusMessage {
  EmailConflict = "The email address you entered already exists in our system.",
  FailedToCreateUser = "We were unable to create the user. Please try again later.",
  UserCreatedSuccessfully = "Your has been created successfully. An OTP has been sent to your email for verification.",
  AccountBlocked = "Your account has been blocked due to security or policy reasons.",
  EmailNotFound = "We could not find an account associated with the provided email address.",
  LoginSuccessful = "You have logged in successfully.",
  FailedToSignin = "We were unable to sign you in. Please try again later.",
  FailedToSendEmail = "There was an error sending the email. Please try again.",
  RegistrationSuccessful = "Your registration was successful. You may now log in.",
  LinkSentToEmail = "A link has been sent to your email",
  AccountNotVerified = "Your account is not verified,Please complete the signup Process",
  GoogleAuthFailed = "Google authentication Failed",
  DifferentLoginMethod = "Please try a different signin method",
  InvalidRole = "Invalid role",
  LogoutSuccessful = "Logged out successfully",
  UserIdRequired = "User id required",
  AllFieldsAreRequired = "All fields are required",
  IdRequired = "Id Required",
  InvalidId = "Invalid id",
}

export enum TrainerStatusMessage {
  TrainersList = "Trainers list retrieved successfully",
  FailedToRetrieveTrainersList = "Failed to retrieve trainers list",
  TrainerApproved = "Trainer approved",
  TrainerRejected = "Trainer rejected",
  FailedToRetrieveTrainerDetails = "Failed to retrieve trainer details",
  FailedToRetrieveTrainerWithSubscription = "Failed to retrieve trainer with subscription details",
  TrainerDetailsRetrieved = "Trainer details retrieved successfully",
  TrainersListRetrieved = "Trainer list retrieved successfully",
}

export enum SlotStatusMessage {
  FailedToCreateBookingSlot = "Failed to add slot",
  SlotCreatedSuccessfully = "Booking slot added successfully",
  SlotDataRetrievedSuccessfully = "Slot data retrieved successfully",
  FailedToGetAvailableSlotData = "Failed to get available slot data",
  SlotDeletedSuccessfully = "Booking slot deleted successfully",
  FailedToDeleteSlot = "Failed to delete Slot",
  FailedToDeleteSlotAlreadyUsedForTakingAppointment = "Slot currently unavailbale, Please try again",
}

export enum AppointmentStatusMessage {
  FailedToBookSlot = "Failed to book slot please try again",
  SlotBookedSuccessfully = "Slot booked successfully. Please wait for confirmation",
  SlotCurrentlyUnavailable = "The slot is currently unavailable. Please try again later",
  BookingRequestsRetrievedSuccessfully = "Booking requests retrieved successfully",
  FailedToRetrieveBookingRequests = "Failed to retrieve booking requests",
  BookingRejected = "Booking rejected successfully",
  BookingApproved = "Booking approved successfully",
  BookingSlotNotFound = "Booking slot not found",
  FailedToApproveRejectBookingStatus = "Failed to change appointment booking status",
  AppointmentsListRetrievedSuccessfully = "Appointments list retrieved successfully",
  FailedToRetrieveAppointmentsList = "Failed to retrieve appointments list",
  AppointmentCancelledSuccessfully = "Appointment cancelled successfully",
  FailedToCancelAppointmentStatus = "Failed to cancel appointment schedule",
  FailedToFindAppointment = "Failed to find appointment data",
}
