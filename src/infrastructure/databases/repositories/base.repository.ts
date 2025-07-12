import mongoose, { Model, Document } from "mongoose";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export abstract class BaseRepository<T extends Document, D>
  implements IBaseRepository<T, D>
{
  protected readonly model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(entity: D): Promise<D> {
    const result = await this.model.create(entity);
    return this.toDomain(result);
  }

  async findById(id: string): Promise<D | null> {
    const result = await this.model.findById(id).exec();
    return result ? this.toDomain(result) : null;
  }

  async update(id: string, entity: Partial<D>): Promise<D | null> {
    const updatedEntity = await this.model
      .findByIdAndUpdate(id, entity as Partial<T>, { new: true })
      .exec();
    return updatedEntity ? this.toDomain(updatedEntity) : null;
  }

  async delete(id: string): Promise<D | null> {
    const deletedEntity = await this.model
      .findByIdAndDelete({ _id: id })
      .exec();
    return deletedEntity ? this.toDomain(deletedEntity) : null;
  }

  async findOne(conditions: object): Promise<D | null> {
    const result = await this.model.findOne(conditions).exec();
    return result ? this.toDomain(result) : null;
  }

  async insertMany(entities: D[]): Promise<void> {
    await this.model.insertMany(entities);
  }

  parseId(id: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(id);
  }

  toDomain(entity: T): D {
    const { _id, __v, ...domainEntity } =
      entity instanceof mongoose.Document
        ? entity.toObject() // If it's a Mongoose document, convert it to a plain object
        : entity; // If it's already a plain object, use it as is

    return {
      ...domainEntity,
      _id: _id.toString(), // Always convert _id to string
    };
  }
}
