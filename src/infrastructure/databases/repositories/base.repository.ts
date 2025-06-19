import mongoose, { Model, Document } from "mongoose";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

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
    return (await this.model.findById(id).lean().exec()) as T;
  }

  async update(id: string, entity: Partial<T>): Promise<T | null> {
    return (await this.model
      .findByIdAndUpdate(id, entity, { new: true })
      .lean()
      .exec()) as T;
  }

  async delete(id: string): Promise<T | null> {
    return (await this.model.findByIdAndDelete({ _id: id }).lean().exec()) as T;
  }

  async findOne(conditions: object): Promise<T | null> {
    return (await this.model.findOne(conditions).lean().exec()) as T;
  }

  async insertMany(entities: T[]): Promise<void> {
    (await this.model.insertMany(entities)).map((doc) => doc.toObject());
  }

  parseId(id: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(id);
  }
}
