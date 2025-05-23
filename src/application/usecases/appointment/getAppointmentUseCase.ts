import { IdDTO, PaginationDTO } from "../../dtos/utility-dtos";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AppointmentStatus,
  AuthStatus,
} from "../../../shared/constants/index-constants";
import {
  Appointment,
  AppointmentRequestsTrainer,
  AppointmentRequestsUser,
} from "../../../domain/entities/appointment";
import { IAppointmentRepository } from "../../../domain/interfaces/IAppointmentRepository";
import {
  GetBookingRequestsDTO,
  GetBookingSchedulesDTO,
} from "../../dtos/query-dtos";
import { parseDateRange } from "../../../shared/utils/dayjs";

export class GetAppointmentUsecase {
  constructor(
    private appointmentRepository: IAppointmentRepository
  ) {}

  public async getBookingRequests(
    trainerId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetBookingRequestsDTO
  ): Promise<{
    bookingRequestsList: AppointmentRequestsTrainer[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(
        AuthStatus.AllFieldsAreRequired
      );
    }

    const { parsedFromDate, parsedToDate } = parseDateRange(fromDate, toDate);

    const { bookingRequestsList, paginationData } =
      await this.appointmentRepository.getBookingAppointmentRequests(
        trainerId,
        {
          page,
          limit,
          fromDate: parsedFromDate,
          toDate: parsedToDate,
          search,
          filters,
        }
      );

    if (!bookingRequestsList) {
      throw new validationError(
        AppointmentStatus.FailedToRetrieveBookingRequests
      );
    }
    return { bookingRequestsList, paginationData };
  }

  public async getTrainerBookingSchedules(
    trainerId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetBookingSchedulesDTO
  ): Promise<{
    trainerBookingSchedulesList: AppointmentRequestsTrainer[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(AuthStatus.IdRequired);
    }

    const { parsedFromDate, parsedToDate } = parseDateRange(fromDate, toDate);

    const { trainerBookingSchedulesList, paginationData } =
      await this.appointmentRepository.getTrainerBookingSchedules(trainerId, {
        page,
        limit,
        fromDate: parsedFromDate,
        toDate: parsedToDate,
        search,
        filters,
      });

    if (!trainerBookingSchedulesList) {
      throw new validationError(
        AppointmentStatus.FailedToRetrieveBookingRequests
      );
    }
    return { trainerBookingSchedulesList, paginationData };
  }

  public async getUserBookingSchedules(
    userId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetBookingSchedulesDTO
  ): Promise<{
    appointmentList: AppointmentRequestsUser[];
    paginationData: PaginationDTO;
  }> {
    if (!userId) {
      throw new validationError(
        AuthStatus.AllFieldsAreRequired
      );
    }

    const { parsedFromDate, parsedToDate } = parseDateRange(fromDate, toDate);

    const { appointmentList, paginationData } =
      await this.appointmentRepository.getUserBookingSchedules(userId, {
        page,
        limit,
        fromDate: parsedFromDate,
        toDate: parsedToDate,
        search,
        filters,
      });

    if (!appointmentList) {
      throw new validationError(
        AppointmentStatus.FailedToRetrieveBookingRequests
      );
    }
    return { appointmentList, paginationData };
  }

  public async getAppointmentById(
    appointmentId: IdDTO
  ): Promise<Appointment | null> {
    if (!appointmentId) {
      throw new validationError(
        AuthStatus.AllFieldsAreRequired
      );
    }
    const appointmentData = await this.appointmentRepository.getAppointmentById(
      appointmentId
    );

    if (!appointmentData) {
      throw new validationError(
        AppointmentStatus.FailedToFindAppointment
      );
    }
    return appointmentData;
  }
}
