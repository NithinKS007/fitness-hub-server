export enum SlotStatus {
  CreateFailed = "There was an error adding the slot. Please try again.",
  Created = "The booking slot has been successfully added.",
  RetrievedSuccess = "Slots retrieved successfully",
  FailedToGetSlots = "Unable to retrieve available slot data. Please check your connection or try again later.",
  Deleted = "The booking slot has been successfully deleted.",
  DeleteFailed = "Failed to delete slot. Please try again later.",
  NotFound = "Slot not found",
  IdTrainerReq = "Trainer is required to view available slots. Please try again later"
}
