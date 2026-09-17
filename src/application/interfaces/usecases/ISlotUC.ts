import { CreateBookingSlotDTO } from "@application/dtos/booking-dtos";
import { IBaseUseCase } from "./IBase.UC";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { BookingSlot } from "@domain/entities/booking-slot.entity";
import { GetSlotsDTO } from "@application/dtos/query-dtos";

export interface ICreateBookingSlotUC
  extends IBaseUseCase<CreateBookingSlotDTO, BookingSlot> {}
export interface IDeleteBookingSlotUC
  extends IBaseUseCase<string, BookingSlot> {}
export interface IGetSlotsUC
  extends IBaseUseCase<
    GetSlotsDTO,
    {
      availableSlotsList: BookingSlot[];
      paginationData: PaginationDTO;
    }
  > {}
