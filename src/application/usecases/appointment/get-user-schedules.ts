import { PaginationDTO } from "@application/dtos/utility-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import {
  AppointmentStatus,
  AuthStatus,
} from "@shared/constants/index.constants";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { GetBookingSchedulesDTO } from "@application/dtos/query-dtos";
import { AppointmentRequestsUser } from "@application/dtos/appointment-dtos";

/*  
    Purpose: Retrieve a list of booking schedules for a specific user with pagination and filters
    Incoming: { userId, page, limit, fromDate, toDate, search, filters } (User's ID and query parameters for filtering)
    Returns: { appointmentList, paginationData } (List of user's booking schedules and pagination details)
    Throws: Error if user ID is missing or booking schedules cannot be retrieved
*/

export class GetUserSchedulesUseCase {
  constructor(private appointmentRepository: IAppointmentRepository) {}
  async execute(
    userId: string,
    { page, limit, fromDate, toDate, search, filters }: GetBookingSchedulesDTO
  ): Promise<{
    appointmentList: AppointmentRequestsUser[];
    paginationData: PaginationDTO;
  }> {
    if (!userId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const query = { page, limit, fromDate, toDate, search, filters };
    const { appointmentList, paginationData } =
      await this.appointmentRepository.getUserSchedules(userId, query);
    if (!appointmentList) {
      throw new validationError(
        AppointmentStatus.FailedToRetrieveBookingRequests
      );
    }
    return { appointmentList, paginationData };
  }
}
