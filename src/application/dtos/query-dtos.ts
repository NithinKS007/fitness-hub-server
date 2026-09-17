// Base-query DTOs
export interface BaseQueryDTO {
  search: string;
  page: number;
  limit: number;
  filters?: string[];
  fromDate?: Date;
  toDate?: Date;
}
// Trainer-related DTOs
export type GetTrainersDTO = BaseQueryDTO & {
  isApproved?: boolean;
  isBlocked?: boolean;
  specialization?: string[];
  experience?: string[];
  gender?: string[];
  sort?: string;
};

export type GetTrainerSubsDTO = Omit<
  BaseQueryDTO,
  "fromDate" | "toDate"
> & { trainerId: string };

export type GetUserTrainersListDTO = Omit<
  BaseQueryDTO,
  "filters" | "fromDate" | "toDate"
> & { userId: string };

//User-related DTOs
export type GetUsersDTO = Omit<BaseQueryDTO, "fromDate" | "toDate">;
export type GetUserSubDTO = Omit<BaseQueryDTO, "fromDate" | "toDate"> & {
  userId: string;
};

// Booking/Schedule-related DTOs
export type GetSlotsDTO = Omit<BaseQueryDTO, "filters" | "search"> & {
  trainerId: string;
  type: string
};
export type GetBookingRequestsDTO = BaseQueryDTO & { trainerId: string };
export type GetTrainerSchedulesDTO = BaseQueryDTO & {
  trainerId: string;
};
export type GetUserSchedulesDTO = BaseQueryDTO & { userId: string };
export type GetTrainerVideoCallLogDTO = BaseQueryDTO & {
  trainerId: string;
};
export type GetUserVideoCallLogDTO = BaseQueryDTO & { userId: string };

//Dashboard-related DTOs
export interface BaseDashBoardDTO {
  period: string;
}
export type DateRangeDTO = { startDate: Date; endDate: Date };
export interface UserDashBoardDTO extends BaseDashBoardDTO {
  userId: string;
  bodyPart: string;
}
export interface GetWeightLiftedByDateDTO
  extends Omit<UserDashBoardDTO, "period"> {
  startDate: Date;
  endDate: Date;
}

//Content-related DTOs
export type GetVideosDTO = BaseQueryDTO & {
  trainerId: string;
  videoPrivacy?: boolean;
  playlistPrivacy?: boolean;
};

export type GetPlayListsDTO = BaseQueryDTO & { trainerId: string };

//Workout-related DTOs
export type GetWorkoutsDTO = BaseQueryDTO & { userId: string };

//FinancialLog-related DTOs
export type GetTransactions = BaseQueryDTO;

export type GetTrainerChatListDTO = Omit<
  BaseQueryDTO,
  "filters" | "fromDate" | "toDate" | "page" | "limit"
> & { trainerId: string };

export type GetUserChatListDTO = Omit<
  BaseQueryDTO,
  "filters" | "fromDate" | "toDate" | "page" | "limit"
> & { userId: string };
