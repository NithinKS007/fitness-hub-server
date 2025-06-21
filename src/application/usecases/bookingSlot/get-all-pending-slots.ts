import { validationError } from "@presentation/middlewares/error.middleware";
import { AuthStatus, SlotStatus } from "@shared/constants/index.constants";
import { IBookingSlotRepository } from "@domain/interfaces/IBookingSlotRepository";
import { IBookingSlot } from "@domain/entities/booking-slot.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";

/**
 * Purpose: Handles the retrieval of all pending booking slots for a given trainer.
 * Incoming: { trainerId } - The ID of the trainer whose pending slots need to be fetched.
 * Returns: IBookingSlot[] - An array of pending booking slots for the trainer.
 * Throws: Error if the trainer ID is missing or the slot data cannot be retrieved.
 */

@injectable()
export class GetAllPendingSlotsUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.BookingSlotRepository)
    private bookingSlotRepository: IBookingSlotRepository
  ) {}
  
  async execute(trainerId: string): Promise<IBookingSlot[]> {
    if (!trainerId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const availableSlotData =
      await this.bookingSlotRepository.getAllPendingSlots(trainerId);
    if (!availableSlotData) {
      throw new validationError(SlotStatus.FailedToGetAvailableSlotData);
    }
    return availableSlotData;
  }
}
