export enum TrainerStatus {
  ListRetrieved = "Trainers list retrieved successfully",
  FailedToRetrieveTrainersList = "Failed to retrieve trainers list",
  Approved = "Trainer has been successfully approved and is now eligible to start offering services.",
  Rejected = "Trainer's application has been rejected. Please review the feedback for further details.",
  FailedToRetrieveTrainerDetails = "Failed to retrieve trainer details",
  FailedToRetrieveTrainerWithSubscription = "Failed to retrieve trainer with subscription details",
  TrainerDetailsRetrieved = "Trainer details retrieved successfully",
}
