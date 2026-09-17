import { Model } from "mongoose";
import { ITrainerRepository } from "@domain/interfaces/ITrainerRepository";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import TrainerModel, { ITrainer } from "../models/trainer.model";
import { Trainer } from "@domain/entities/trainer.entity";

export class TrainerRepository
  extends BaseRepository<ITrainer, Trainer>
  implements ITrainerRepository
{
  constructor(model: Model<ITrainer> = TrainerModel) {
    super(model);
  }
  async countPendingTrainerApprovals(): Promise<number> {
    return await this.model.countDocuments({ isApproved: false });
  }
}
