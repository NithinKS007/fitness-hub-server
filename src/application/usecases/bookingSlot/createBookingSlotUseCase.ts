import { CreateBookingSlotDTO } from "../../dtos/booking-dtos";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AuthStatus,
  SlotStatus,
} from "../../../shared/constants/index-constants";

import { BookingSlot } from "../../../domain/entities/bookingSlot";
import { IBookingSlotRepository } from "../../../domain/interfaces/IBookingSlotRepository";

export class CreateBookingSlotUseCase {
  constructor(private bookingSlotRepository: IBookingSlotRepository) {}

  public async addBookingSlot(
    slotData: CreateBookingSlotDTO
  ): Promise<BookingSlot> {
    const { date, ...otherSlotData } = slotData;
    if (!slotData) {
      throw new validationError(
        AuthStatus.AllFieldsAreRequired
      );
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
