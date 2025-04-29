import { IdDTO, PaginationDTO } from "../../dtos/utilityDTOs";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AuthenticationStatusMessage,
  SlotStatusMessage,
} from "../../../shared/constants/httpResponseStructure";
import { BookingSlot } from "../../../domain/entities/bookingSlot";
import { IBookingSlotRepository } from "../../../domain/interfaces/IBookingSlotRepository";
import { AvailableSlotsQueryDTO } from "../../dtos/queryDTOs";
import { parseDateRange } from "../../../shared/utils/dayjs";

export class GetBookingSlotUseCase {
  constructor(private bookingSlotRepository: IBookingSlotRepository) {}

  public async getAvailableSlots(
    trainerId: IdDTO,
    { page, limit, fromDate, toDate }: AvailableSlotsQueryDTO
  ): Promise<{
    availableSlotsList: BookingSlot[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(AuthenticationStatusMessage.IdRequired);
    }

    const { parsedFromDate, parsedToDate } = parseDateRange(fromDate, toDate);

    const { availableSlotsList, paginationData } =
      await this.bookingSlotRepository.getAvailableSlots(trainerId, {
        page,
        limit,
        fromDate: parsedFromDate,
        toDate: parsedToDate,
      });
    if (!availableSlotsList) {
      throw new validationError(SlotStatusMessage.FailedToGetAvailableSlotData);
    }
    return { availableSlotsList, paginationData };
  }

  public async getAvailableSlotsFromToday(
    trainerId: IdDTO,
    { page, limit, fromDate, toDate }: AvailableSlotsQueryDTO
  ): Promise<{
    availableSlotsList: BookingSlot[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(AuthenticationStatusMessage.IdRequired);
    }

    const { parsedFromDate, parsedToDate } = parseDateRange(fromDate, toDate);

    const { availableSlotsList, paginationData } =
      await this.bookingSlotRepository.getAvailableSlotsFromToday(trainerId, {
        page,
        limit,
        fromDate: parsedFromDate,
        toDate: parsedToDate,
      });
    if (!availableSlotsList) {
      throw new validationError(SlotStatusMessage.FailedToGetAvailableSlotData);
    }
    return { availableSlotsList, paginationData };
  }

  public async getAllAvailableSlotsFromToday(
    trainerId: IdDTO
  ): Promise<BookingSlot[]> {
    if (!trainerId) {
      throw new validationError(AuthenticationStatusMessage.IdRequired);
    }
    const availableSlotData =
      await this.bookingSlotRepository.getAllAvailableSlotsFromToday(trainerId);
    if (!availableSlotData) {
      throw new validationError(SlotStatusMessage.FailedToGetAvailableSlotData);
    }
    return availableSlotData;
  }
}
