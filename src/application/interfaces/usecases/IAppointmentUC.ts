import {
  BookAppointmentDTO,
  HandleBookingDTO,
} from "@application/dtos/booking-dtos";
import { IBaseUseCase } from "./IBase.UC";
import { Appointment } from "@domain/entities/appointment.entity";
import {
  GetBookingRequestsDTO,
  GetTrainerSchedulesDTO,
  GetUserSchedulesDTO,
} from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import {
  AppointmentsTRUILayer,
  AppointmentsURUILayer,
} from "@infrastructure/mappers/appointment.mapper";

export interface IBookAppointmentUC
  extends IBaseUseCase<BookAppointmentDTO, Appointment> {}
export interface ICancelAppointmentUC
  extends IBaseUseCase<HandleBookingDTO, Appointment> {}
export interface IGetAppointmentRequestsUC
  extends IBaseUseCase<
    GetBookingRequestsDTO,
    {
      bookingRequestsList: AppointmentsTRUILayer[];
      paginationData: PaginationDTO;
    }
  > {}
export interface IGetAppointmentByIdUC
  extends IBaseUseCase<string, Appointment> {}
export interface IGetTrainerSchedulesUC
  extends IBaseUseCase<
    GetTrainerSchedulesDTO,
    {
      trainerBookingSchedulesList: AppointmentsTRUILayer[];
      paginationData: PaginationDTO;
    }
  > {}
export interface IGetUserSchedulesUC
  extends IBaseUseCase<
    GetUserSchedulesDTO,
    {
      appointmentList: AppointmentsURUILayer[];
      paginationData: PaginationDTO;
    }
  > {}
export interface IHandleBookingApprovalUC
  extends IBaseUseCase<HandleBookingDTO, Appointment> {}
