import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  SlotStatus,
  AppointmentStatus,
  ApplicationStatus,
} from "../../../shared/constants/index.constants";

import { BookingSlot } from "../../../domain/entities/booking-slot.entities";
import { IBookingSlotRepository } from "../../../domain/interfaces/IBookingSlotRepository";

export class DeleteBookingSlotUseCase {
  constructor(private bookingSlotRepository: IBookingSlotRepository) {}
  async deleteBookingSlot(bookingSlotId: string): Promise<BookingSlot> {
    if (!bookingSlotId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const slotData = await this.bookingSlotRepository.findSlotById(
      bookingSlotId
    );

    if (slotData?.status === "booked" || slotData?.status === "completed") {
      throw new validationError(AppointmentStatus.SlotCurrentlyUnavailable);
    }
    const deletedSlotData =
      await this.bookingSlotRepository.findByIdAndDeleteSlot(bookingSlotId);

    if (!deletedSlotData) {
      throw new validationError(SlotStatus.FailedToDeleteSlot);
    }
    return deletedSlotData;
  }
}
