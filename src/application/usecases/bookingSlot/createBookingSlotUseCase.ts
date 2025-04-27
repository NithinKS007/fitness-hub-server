import { CreateBookingSlotDTO } from "../../dtos/bookingDTOs";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AuthenticationStatusMessage,
  SlotStatusMessage,
} from "../../../shared/constants/httpResponseStructure";

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
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }
    const createdSlotData = await this.bookingSlotRepository.addBookingSlot({
      date: new Date(date),
      ...otherSlotData,
    });

    if (!createdSlotData) {
      throw new validationError(SlotStatusMessage.FailedToCreateBookingSlot);
    }
    return createdSlotData;
  }
}
