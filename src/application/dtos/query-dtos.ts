// Base-query DTOs
export interface BaseQueryDTO {
  search: string;
  page: number;
  limit: number;
  filters: string[];
  fromDate: Date | undefined;
  toDate: Date | undefined;
}
// Trainer-related DTOs
export type GetTrainersQueryDTO = Omit<BaseQueryDTO, "fromDate" | "toDate">;
export type GetTrainersApprovalQueryDTO = Omit<BaseQueryDTO, "filters">;
export type GetTrainerSubscribersQueryDTO = Omit<
  BaseQueryDTO,
  "fromDate" | "toDate"
>;
export type GetApprovedTrainerQueryDTO = Omit<
  BaseQueryDTO,
  "fromDate" | "toDate" | "filters"
> & {
  specialization: string[];
  experience: string[];
  gender: string[];
  sort: string;
};

export type GetUserTrainersListQueryDTO = Omit<
  BaseQueryDTO,
  "filters" | "fromDate" | "toDate"
>;

//User-related DTOs
export type GetUsersQueryDTO = Omit<BaseQueryDTO, "fromDate" | "toDate">;
export type GetUserSubscriptionsQueryDTO = Omit<
  BaseQueryDTO,
  "fromDate" | "toDate"
>;

// Booking/Schedule-related DTOs
export type AvailableSlotsQueryDTO = Omit<BaseQueryDTO, "filters" | "search">;
export type GetBookingRequestsDTO = BaseQueryDTO;
export type GetBookingSchedulesDTO = BaseQueryDTO;
export type GetVideoCallLogQueryDTO = BaseQueryDTO;

//Dashboard-related DTOs
export interface BaseDashBoardQueryDTO {
  period: string;
}
export type DateRangeQueryDTO = { startDate: Date; endDate: Date };
export interface UserDashBoardQueryDTO extends BaseDashBoardQueryDTO {
  userId: string;
  bodyPart: string;
}
export interface CustomUserDashBoardQueryDTO
  extends Omit<UserDashBoardQueryDTO, "period"> {
  startDate: Date;
  endDate: Date;
}

//Content-related DTOs
export type GetVideoQueryDTO = BaseQueryDTO;
export type GetPlayListsQueryDTO = BaseQueryDTO;

//Workout-related DTOs
export type GetWorkoutQueryDTO = BaseQueryDTO;

//Revenue-related DTOs
export type GetRevenueQueryDTO = BaseQueryDTO;

export type GetChatListQueryDTO = Omit<
  BaseQueryDTO,
  "filters" | "fromDate" | "toDate" | "page" | "limit"
>;
