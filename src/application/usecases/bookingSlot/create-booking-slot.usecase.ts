import { CreateBookingSlotDTO } from "../../dtos/booking-dtos";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  SlotStatus,
} from "../../../shared/constants/index.constants";
import { BookingSlot } from "../../../domain/entities/booking-slot.entities";
import { IBookingSlotRepository } from "../../../domain/interfaces/IBookingSlotRepository";

export class CreateBookingSlotUseCase {
  constructor(private bookingSlotRepository: IBookingSlotRepository) {}
  async addBookingSlot(slotData: CreateBookingSlotDTO): Promise<BookingSlot> {
    const { date, ...otherSlotData } = slotData;
    if (!slotData) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const createdSlotData = await this.bookingSlotRepository.addBookingSlot({
      date: new Date(date),
      ...otherSlotData,
    });

    if (!createdSlotData) {
      throw new validationError(SlotStatus.FailedToCreateBookingSlot);
    }
    return createdSlotData;
  }
}
