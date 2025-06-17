import { PaginationDTO } from "@application/dtos/utility-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  AppointmentStatus,
} from "@shared/constants/index.constants";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { GetBookingRequestsDTO } from "@application/dtos/query-dtos";
import { AppointmentRequestsTrainer } from "@application/dtos/appointment-dtos";

/*  
    Purpose: Retrieve a list of booking requests for a specific trainer with pagination and filters
    Incoming: { trainerId, page, limit, fromDate, toDate, search, filters } 
    (Trainer's ID and query parameters for filtering)
    Returns: { bookingRequestsList, paginationData } (List of booking requests and pagination details)
    Throws: Error if trainer ID is missing or booking requests cannot be retrieved
*/

export class GetAppointmentRequestUseCase {
  constructor(private appointmentRepository: IAppointmentRepository) {}
  async execute(
    trainerId: string,
    { page, limit, fromDate, toDate, search, filters }: GetBookingRequestsDTO
  ): Promise<{
    bookingRequestsList: AppointmentRequestsTrainer[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const query = { page, limit, fromDate, toDate, search, filters };
    const { bookingRequestsList, paginationData } =
      await this.appointmentRepository.getBookingRequests(trainerId, query);

    if (!bookingRequestsList) {
      throw new validationError(
        AppointmentStatus.FailedToRetrieveBookingRequests
      );
    }
    return { bookingRequestsList, paginationData };
  }
}
