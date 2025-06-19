import { validationError } from "@presentation/middlewares/error.middleware";
import {
  SlotStatus,
  AppointmentStatus,
  ApplicationStatus,
} from "@shared/constants/index.constants";
import { IBookingSlotRepository } from "@domain/interfaces/IBookingSlotRepository";
import { BookingSlotStatus } from "@application/dtos/booking-dtos";
import { IBookingSlot } from "@domain/entities/booking-slot.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "di/types-repositories";

/**
 * Purpose: Handles the deletion of a booking slot based on its slot id.
 * Incoming: { bookingSlotId } - The ID of the booking slot to be deleted.
 * Returns: IBookingSlot - The deleted booking slot data.
 * Throws: Error if any required fields are missing or the slot cannot be deleted.
 */

@injectable()
export class DeleteBookingSlotUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.BookingSlotRepository)
    private bookingSlotRepository: IBookingSlotRepository
  ) {}

  async execute(bookingSlotId: string): Promise<IBookingSlot> {
    if (!bookingSlotId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const slotData = await this.bookingSlotRepository.findById(bookingSlotId);
    if (
      slotData?.status === BookingSlotStatus.BOOKED ||
      slotData?.status === BookingSlotStatus.COMPLETED
    ) {
      throw new validationError(AppointmentStatus.SlotCurrentlyUnavailable);
    }
    const deletedSlotData = await this.bookingSlotRepository.delete(
      bookingSlotId
    );
    if (!deletedSlotData) {
      throw new validationError(SlotStatus.FailedToDeleteSlot);
    }
    return deletedSlotData;
  }
}
