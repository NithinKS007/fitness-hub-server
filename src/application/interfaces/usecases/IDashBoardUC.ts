import { IBaseUseCase } from "./IBase.UC";
import { UserDashBoardQueryDTO } from "@application/dtos/query-dtos";
import {
  AdminDashBoardStats,
  TrainerDashboardStats,
} from "@application/dtos/trainer-dtos";
import { UserDashBoard } from "@application/dtos/workout-dtos";

export interface IAdminDashBoardUC
  extends IBaseUseCase<string, AdminDashBoardStats> {}
export interface ITrainerDashBoardUC
  extends IBaseUseCase<
    {
      trainerId: string;
      period: string;
    },
    TrainerDashboardStats
  > {}
export interface IUserDashBoardUC
  extends IBaseUseCase<UserDashBoardQueryDTO, UserDashBoard> {}
