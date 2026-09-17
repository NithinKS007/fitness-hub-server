export enum TrainerStatus {
  FetchedList = "Trainers list retrieved successfully",
  ListFetchFailed = "Failed to retrieve trainers list",
  Approved = "Trainer has been successfully approved and is now eligible to start offering services.",
  Rejected = "Trainer's application has been rejected. Please review the feedback for further details.",
  FailedToFetchDetails = "Failed to retrieve trainer details",
  FetchedDetails = "Trainer details retrieved successfully",
  UpdateFailed = "Failed to update trainer details, Please try again later",
}
