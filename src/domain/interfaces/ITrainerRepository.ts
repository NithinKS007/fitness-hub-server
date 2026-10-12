import { Trainer } from "@domain/entities/trainer.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface ITrainerRepository extends IBaseRepository<Trainer> {
  countPendingTrainerApprovals(): Promise<number>;
}
