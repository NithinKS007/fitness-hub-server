import { CreateBookingSlotDTO } from "@application/dtos/booking-dtos";
import { IBaseUseCase } from "./IBase.UC";
import { AvailableSlotsQueryDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { BookingSlot } from "@domain/entities/booking-slot.entity";

export interface ICreateBookingSlotUC
  extends IBaseUseCase<CreateBookingSlotDTO, BookingSlot> {}
export interface IDeleteBookingSlotUC
  extends IBaseUseCase<string, BookingSlot> {}
export interface IGetPendingSlotsUC
  extends IBaseUseCase<
    AvailableSlotsQueryDTO,
    {
      availableSlotsList: BookingSlot[];
      paginationData: PaginationDTO;
    }
  > {}
export interface IGetUpComingSlotsUC
  extends IBaseUseCase<
    AvailableSlotsQueryDTO,
    {
      availableSlotsList: BookingSlot[];
      paginationData: PaginationDTO;
    }
  > {}
