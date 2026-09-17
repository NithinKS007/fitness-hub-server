import { PagedResponse } from "@application/dtos/utility-dtos";
import { GetTrainersDTO, GetUsersDTO } from "@application/dtos/query-dtos";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { User } from "@domain/entities/user.entity";
import { IUser } from "@infrastructure/databases/models/user.model";
import { Trainer } from "@domain/entities/trainer.entity";

export interface IUserRepository extends IBaseRepository<IUser, User> {
  getUsers(dtos: GetUsersDTO): Promise<PagedResponse<User>>;
  countDocs(role: string): Promise<number>;
  getTrainers(dtos: GetTrainersDTO): Promise<
    PagedResponse<
      Omit<User, "password" | "createdAt" | "updatedAt"> & {
        trainerDetails: Omit<Trainer, "createdAt" | "updatedAt">;
      }
    >
  >;
}
