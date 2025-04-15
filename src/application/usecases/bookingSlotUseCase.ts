import {
  HandleBookingRequestDTO,
  BookAppointmentDTO,
  CreateBookingSlotDTO,
} from "../dtos/bookingDTOs";
import { IdDTO, PaginationDTO } from "../dtos/utilityDTOs";
import { validationError } from "../../presentation/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import {
  Appointment,
  AppointmentRequestsTrainer,
  AppointmentRequestsUser,
} from "../../domain/entities/appointmentEntity";
import { BookingSlot } from "../../domain/entities/bookingSlotEntity";
import { IBookingSlotRepository } from "../../domain/interfaces/IBookingSlotRepository";
import { IAppointmentRepository } from "../../domain/interfaces/IAppointmentRepository";
import { IVideoCallLogRepository } from "../../domain/interfaces/IVideoCallLogRepository";
import {
  AvailableSlotsQueryDTO,
  GetBookingRequestsDTO,
  GetBookingSchedulesDTO,
  GetVideoCallLogQueryDTO,
} from "../dtos/queryDTOs";
import {
  TrainerVideoCallLog,
  UserVideoCallLog,
} from "../../domain/entities/videoCallLogEntity";
import { parseDateRange } from "../../shared/utils/dayjs";

export class BookingSlotUseCase {
  constructor(
    private bookingSlotRepository: IBookingSlotRepository,
    private appointmentRepository: IAppointmentRepository,
    private videoCallLogRepository: IVideoCallLogRepository
  ) {}

  public async addBookingSlot(
    slotData: CreateBookingSlotDTO
  ): Promise<BookingSlot> {
    const { date, ...otherSlotData } = slotData;
    if (!slotData) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const createdSlotData = await this.bookingSlotRepository.addBookingSlot({
      date: new Date(date),
      ...otherSlotData,
    });

    if (!createdSlotData) {
      throw new validationError(HttpStatusMessages.FailedToCreateBookingSlot);
    }
    return createdSlotData;
  }

  public async getAvailableSlotsTrainer(
    trainerId: IdDTO,
    { page, limit, fromDate, toDate }: AvailableSlotsQueryDTO
  ): Promise<{
    availableSlotsList: BookingSlot[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(HttpStatusMessages.IdRequired);
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
      throw new validationError(
        HttpStatusMessages.FailedToGetAvailableSlotData
      );
    }
    return { availableSlotsList, paginationData };
  }

  public async getAvailableSlotsUser(trainerId: IdDTO): Promise<BookingSlot[]> {
    if (!trainerId) {
      throw new validationError(HttpStatusMessages.IdRequired);
    }
    const availableSlotData =
      await this.bookingSlotRepository.getAvailableSlotsUser(trainerId);
    if (!availableSlotData) {
      throw new validationError(
        HttpStatusMessages.FailedToGetAvailableSlotData
      );
    }
    return availableSlotData;
  }

  public async bookSlotAppointment({
    slotId,
    userId,
  }: BookAppointmentDTO): Promise<Appointment> {
    if (!slotId || !userId) {
      throw new validationError(HttpStatusMessages.IdRequired);
    }

    const bookingSlot = await this.bookingSlotRepository.findSlotById(slotId);

    if (!bookingSlot) {
      throw new validationError(HttpStatusMessages.FailedToBookSlot);
    }

    if (bookingSlot.status === "booked" || bookingSlot.status === "completed") {
      throw new validationError(HttpStatusMessages.SlotCurrentlyUnavailable);
    }

    const {
      _id: bookingSlotId,
      trainerId,
      date: appointmentDate,
      time: appointmentTime,
    } = bookingSlot;

    const appointmentData = await this.appointmentRepository.createAppointment({
      bookingSlotId,
      trainerId,
      appointmentDate,
      appointmentTime,
      userId,
    });

    const bookingSlotData =
      await this.bookingSlotRepository.findBookSlotAndChangeStatusTobooked(
        bookingSlot._id.toString()
      );

    if (!appointmentData || !bookingSlotData) {
      throw new validationError(HttpStatusMessages.FailedToBookSlot);
    }
    return appointmentData;
  }

  public async getBookingRequests(
    trainerId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetBookingRequestsDTO
  ): Promise<{
    bookingRequestsList: AppointmentRequestsTrainer[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
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
        HttpStatusMessages.FailedToRetrieveBookingRequests
      );
    }
    return { bookingRequestsList, paginationData };
  }

  public async approveOrRejectBooking({
    appointmentId,
    bookingSlotId,
    action,
  }: HandleBookingRequestDTO): Promise<Appointment> {
    if (!appointmentId || bookingSlotId || action) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const bookingSlotData = await this.bookingSlotRepository.findSlotById(
      bookingSlotId
    );

    if (!bookingSlotData) {
      throw new validationError(HttpStatusMessages.BookingSlotNotFound);
    }

    if (action === "approved") {
      await this.bookingSlotRepository.findBookSlotAndChangeStatusToCompleted(
        bookingSlotId
      );
    } else {
      await this.bookingSlotRepository.findBookSlotAndChangeStatusToPending(
        bookingSlotId
      );
    }
    const appointmentData =
      await this.appointmentRepository.approveOrRejectAppointment({
        appointmentId,
        action,
        bookingSlotId,
      });

    if (!appointmentData) {
      throw new validationError(
        HttpStatusMessages.FailedToApproveRejectBookingStatus
      );
    }
    return appointmentData;
  }

  public async getTrainerBookingSchedules(
    trainerId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetBookingSchedulesDTO
  ): Promise<{
    trainerBookingSchedulesList: AppointmentRequestsTrainer[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(HttpStatusMessages.IdRequired);
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
        HttpStatusMessages.FailedToRetrieveBookingRequests
      );
    }
    return { trainerBookingSchedulesList, paginationData };
  }

  public async cancelAppointment(appointmentId: IdDTO): Promise<Appointment> {
    if (!appointmentId) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const cancelledAppointment =
      await this.appointmentRepository.cancelAppointmentSchedule(appointmentId);

    if (!cancelledAppointment) {
      throw new validationError(
        HttpStatusMessages.FailedToCancelAppointmentStatus
      );
    }

    const makingbookingSlotAvailableAgain =
      await this.bookingSlotRepository.findBookSlotAndChangeStatusToPending(
        cancelledAppointment.bookingSlotId.toString()
      );
    if (!makingbookingSlotAvailableAgain) {
      throw new validationError(
        HttpStatusMessages.FailedToCancelAppointmentStatus
      );
    }

    return cancelledAppointment;
  }

  public async getUserBookingSchedules(
    userId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetBookingSchedulesDTO
  ): Promise<{
    appointmentList: AppointmentRequestsUser[];
    paginationData: PaginationDTO;
  }> {
    if (!userId) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
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
        HttpStatusMessages.FailedToRetrieveBookingRequests
      );
    }
    return { appointmentList, paginationData };
  }

  public async deleteBookingSlot(bookingSlotId: IdDTO): Promise<BookingSlot> {
    if (!bookingSlotId) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }

    const slotData = await this.bookingSlotRepository.findSlotById(
      bookingSlotId
    );

    if (slotData?.status === "booked" || slotData?.status === "completed") {
      throw new validationError(HttpStatusMessages.SlotCurrentlyUnavailable);
    }
    const deletedSlotData =
      await this.bookingSlotRepository.findByIdAndDeleteSlot(bookingSlotId);

    if (!deletedSlotData) {
      throw new validationError(HttpStatusMessages.FailedToDeleteSlot);
    }
    return deletedSlotData;
  }

  public async getAppointmentById(
    appointmentId: IdDTO
  ): Promise<Appointment | null> {
    if (!appointmentId) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const appointmentData = await this.appointmentRepository.getAppointmentById(
      appointmentId
    );

    if (!appointmentData) {
      throw new validationError(HttpStatusMessages.FailedToFindAppointment);
    }
    return appointmentData;
  }

  public async getTrainerVideoCallLogs(
    trainerId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetVideoCallLogQueryDTO
  ): Promise<{
    trainerVideoCallLogList: TrainerVideoCallLog[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }

    const { parsedFromDate, parsedToDate } = parseDateRange(fromDate, toDate);

    const { trainerVideoCallLogList, paginationData } =
      await this.videoCallLogRepository.getTrainerVideoCallLogs(trainerId, {
        page,
        limit,
        fromDate: parsedFromDate,
        toDate: parsedToDate,
        search,
        filters,
      });

    if (!trainerVideoCallLogList) {
      throw new validationError(
        HttpStatusMessages.FailedToRetrieveVideoCallLogs
      );
    }
    return { trainerVideoCallLogList, paginationData };
  }

  public async getUserVideoCallLogs(
    userId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetVideoCallLogQueryDTO
  ): Promise<{
    userVideoCallLogList: UserVideoCallLog[];
    paginationData: PaginationDTO;
  }> {
    if (!userId) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }

    const { parsedFromDate, parsedToDate } = parseDateRange(fromDate, toDate);

    const { userVideoCallLogList, paginationData } =
      await this.videoCallLogRepository.getUserVideoCallLogs(userId, {
        page,
        limit,
        fromDate: parsedFromDate,
        toDate: parsedToDate,
        search,
        filters,
      });

    if (!userVideoCallLogList) {
      throw new validationError(
        HttpStatusMessages.FailedToRetrieveVideoCallLogs
      );
    }
    return { userVideoCallLogList, paginationData };
  }
}
