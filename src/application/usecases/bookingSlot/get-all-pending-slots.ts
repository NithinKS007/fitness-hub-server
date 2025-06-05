import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  AuthStatus,
  SlotStatus,
} from "../../../shared/constants/index.constants";
import { BookingSlot } from "../../../domain/entities/booking-slot.entities";
import { IBookingSlotRepository } from "../../../domain/interfaces/IBookingSlotRepository";

export class GetAllPendingSlotsUseCase {
  constructor(private bookingSlotRepository: IBookingSlotRepository) {}
  async execute(trainerId: string): Promise<BookingSlot[]> {
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
