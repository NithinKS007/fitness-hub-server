import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  SlotStatus,
  AppointmentStatus,
  ApplicationStatus,
} from "../../../shared/constants/index.constants";
import { IBookingSlotRepository } from "../../../domain/interfaces/IBookingSlotRepository";
import { IBookingSlot } from "../../../infrastructure/databases/models/booking.slot";
import { BookingSlotStatus } from "../../dtos/booking-dtos";

export class DeleteBookingSlotUseCase {
  constructor(private bookingSlotRepository: IBookingSlotRepository) {}
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
