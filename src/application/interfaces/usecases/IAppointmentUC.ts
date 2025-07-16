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
import {
  AppointmentRequestsTrainer,
  AppointmentRequestsUser,
} from "@application/dtos/appointment-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";

export interface IBookAppointmentUC
  extends IBaseUseCase<BookAppointmentDTO, Appointment> {}
export interface ICancelAppointmentUC
  extends IBaseUseCase<string, Appointment> {}
export interface IGetAppointmentRequestsUC
  extends IBaseUseCase<
    GetBookingRequestsDTO,
    {
      bookingRequestsList: AppointmentRequestsTrainer[];
      paginationData: PaginationDTO;
    }
  > {}
export interface IGetAppointmentByIdUC
  extends IBaseUseCase<string, Appointment> {}
export interface IGetTrainerSchedulesUC
  extends IBaseUseCase<
    GetTrainerSchedulesDTO,
    {
      trainerBookingSchedulesList: AppointmentRequestsTrainer[];
      paginationData: PaginationDTO;
    }
  > {}
export interface IGetUserSchedulesUC
  extends IBaseUseCase<
    GetUserSchedulesDTO,
    {
      appointmentList: AppointmentRequestsUser[];
      paginationData: PaginationDTO;
    }
  > {}
export interface IHandleBookingApprovalUC
  extends IBaseUseCase<HandleBookingDTO, Appointment> {}
