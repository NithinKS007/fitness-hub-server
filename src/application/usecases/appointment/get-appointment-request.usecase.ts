import { PaginationDTO } from "@application/dtos/utility-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  AppointmentStatus,
} from "@shared/constants/index.constants";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { GetBookingRequestsDTO } from "@application/dtos/query-dtos";
import { AppointmentRequestsTrainer } from "@application/dtos/appointment-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IGetAppointmentRequestsUC } from "@application/interfaces/usecases/IAppointmentUC";

/*  
    Purpose: Retrieve a list of booking requests for a specific trainer with pagination and filters
    Incoming: { trainerId, page, limit, fromDate, toDate, search, filters } 
    (Trainer's ID and query parameters for filtering)
    Returns: { bookingRequestsList, paginationData } (List of booking requests and pagination details)
    Throws: Error if trainer ID is missing or booking requests cannot be retrieved
*/

@injectable()
export class GetAppointmentRequestUseCase implements IGetAppointmentRequestsUC {
  constructor(
    @inject(TYPES_REPOSITORIES.AppointmentRepository)
    private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(
    { trainerId ,page, limit, fromDate, toDate, search, filters }: GetBookingRequestsDTO
  ): Promise<{
    bookingRequestsList: AppointmentRequestsTrainer[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const dtos = { trainerId,page, limit, fromDate, toDate, search, filters };
    const { bookingRequestsList, paginationData } =
      await this.appointmentRepository.getBookingRequests(dtos);

    if (!bookingRequestsList) {
      throw new validationError(AppointmentStatus.BookingRequestsFetchFailed);
    }
    return { bookingRequestsList, paginationData };
  }
}
