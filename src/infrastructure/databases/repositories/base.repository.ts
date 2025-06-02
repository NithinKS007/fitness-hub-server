import { Model, Document } from "mongoose";
import { IBaseRepository } from "../../../domain/interfaces/IBaseRepository";

export abstract class BaseRepository<T extends Document>
  implements IBaseRepository<T>
{
  protected readonly model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(entity: T): Promise<T> {
    return (await this.model.create(entity)).toObject();
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async update(id: string, entity: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, entity, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async getAll(): Promise<T[]> {
    return await this.model.find().exec();
  }
}
