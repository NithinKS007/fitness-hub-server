export enum WorkoutStatus {
  FailedToAdd = "Failed to add workout. Please try again",
  FailedToGet  = "Failed to retrieve workout data. Please check your connection.",
  Retrieved  = "The workout list was successfully retrieved.",
  Added  = "The workout has been successfully added.",
  FailedToDelete  = "Failed to delete the workout set. Please try again.",
  FailedToMarkCompletion  = "Failed to update the completion status of the workout.",
  Completed  = "The workout was completed successfully.",
  Deleted  = "The workout set has been deleted successfully.",
  cannotCompleteFutureWorkouts = "You cannot mark a workout as complete before its scheduled date",
}
