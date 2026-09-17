// Base-query DTOs
export interface BaseQueryDTO {
  search: string;
  page: number;
  limit: number;
  filters: string[];
  fromDate?: Date;
  toDate?: Date;
}
// Trainer-related DTOs
export type GetTrainersQueryDTO = Omit<BaseQueryDTO, "fromDate" | "toDate">;
export type GetTrainersApprovalQueryDTO = Omit<BaseQueryDTO, "filters">;
export type GetTrainerSubscribersQueryDTO = Omit<
  BaseQueryDTO,
  "fromDate" | "toDate"
> & { trainerId: string };
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
> & { userId: string };

//User-related DTOs
export type GetUsersQueryDTO = Omit<BaseQueryDTO, "fromDate" | "toDate">;
export type GetUserSubscriptionsQueryDTO = Omit<
  BaseQueryDTO,
  "fromDate" | "toDate"
> & { userId: string };

// Booking/Schedule-related DTOs
export type AvailableSlotsQueryDTO = Omit<
  BaseQueryDTO,
  "filters" | "search"
> & { trainerId: string };
export type GetBookingRequestsDTO = BaseQueryDTO & { trainerId: string };
export type GetTrainerSchedulesDTO = BaseQueryDTO & {
  trainerId: string;
};
export type GetUserSchedulesDTO = BaseQueryDTO & { userId: string };
export type GetTrainerVideoCallLogQueryDTO = BaseQueryDTO & {
  trainerId: string;
};
export type GetUserVideoCallLogQueryDTO = BaseQueryDTO & { userId: string };

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
export type GetVideoQueryDTO = BaseQueryDTO & {
  trainerId: string;
  videoPrivacy?: boolean;
  playlistPrivacy?: boolean;
};

export type GetPlayListsQueryDTO = BaseQueryDTO & { trainerId: string };

//Workout-related DTOs
export type GetWorkoutQueryDTO = BaseQueryDTO & { userId: string };

//Revenue-related DTOs
export type GetRevenueQueryDTO = BaseQueryDTO;

export type GetTrainerChatListDTO = Omit<
  BaseQueryDTO,
  "filters" | "fromDate" | "toDate" | "page" | "limit"
> & { trainerId: string };

export type GetUserChatListDTO = Omit<
  BaseQueryDTO,
  "filters" | "fromDate" | "toDate" | "page" | "limit"
> & { userId: string };
