import { IdDTO } from "../../dtos/utility-dtos";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AppointmentStatusMessage,
  AuthenticationStatusMessage,
  SlotStatusMessage,
} from "../../../shared/constants/httpResponseStructure";
import { BookingSlot } from "../../../domain/entities/bookingSlot";
import { IBookingSlotRepository } from "../../../domain/interfaces/IBookingSlotRepository";

export class DeleteBookingSlotUseCase {
  constructor(private bookingSlotRepository: IBookingSlotRepository) {}

  public async deleteBookingSlot(bookingSlotId: IdDTO): Promise<BookingSlot> {
    if (!bookingSlotId) {
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }
    const slotData = await this.bookingSlotRepository.findSlotById(
      bookingSlotId
    );

    if (slotData?.status === "booked" || slotData?.status === "completed") {
      throw new validationError(
        AppointmentStatusMessage.SlotCurrentlyUnavailable
      );
    }
    const deletedSlotData =
      await this.bookingSlotRepository.findByIdAndDeleteSlot(bookingSlotId);

    if (!deletedSlotData) {
      throw new validationError(SlotStatusMessage.FailedToDeleteSlot);
    }
    return deletedSlotData;
  }
}
