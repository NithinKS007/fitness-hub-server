import { Trainer } from "@domain/entities/trainer.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { ITrainer } from "@infrastructure/databases/models/trainer.model";

export interface ITrainerRepository extends IBaseRepository<ITrainer, Trainer> {
  countPendingTrainerApprovals(): Promise<number>;
}
