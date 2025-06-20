export enum SubscriptionStatus {
  Created = "Subscription added successfully",
  AlreadyExists = "Cannot made changes, subscription already exists",
  ListRetrieved = "Subscriptions list retrieved successfully",
  NotFound = "Subscription not found or unavailable",
  SessionCreateFailed = "Failed to create subscription session",
  WebHookCredentialsMissing = "Web hook credentials are missing",
  WebHookVerificationFailed = "Webhook signature verification failed",
  SubscriptionIdAndTraineIdMissing = "Missing metadata: subscriptionId or trainerId.",
  UserSubscriptionsRetrieved = "User subscription list retrieved successfully",
  Cancelled = "Your subscription has been cancelled successfully",
  InvalidSessionIdForStripe = "Invalid session id for stripe",
  Blocked = "Subscription Currently unavailable",
  UserIsSubscribed = "The current user is subscribed",
  StatusUpdated = "Subscription block status updated successfully",
  DeleteFailed = "Failed to delete subscription",
  EditedSuccess = "Subscription edited successfully",
  DeletedSuccess = "Subscription deleted successfully",
  EditFailed = "Failed to edit subscription",
  CancelFailed = "Failed to cancel subscription",
}
