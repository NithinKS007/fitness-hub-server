import mongoose, { Model, Document } from "mongoose";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export abstract class BaseRepository<T extends Document, D>
  implements IBaseRepository<D>
{
  protected readonly model: Model<T>;
  constructor(model: Model<T>, protected readonly projection: string) {
    this.model = model;
  }

  public create = async (entity: D): Promise<D> => {
    const result = await this.model.create(entity);
    return this.toDomain(result);
  };

  public findById = async (id: string): Promise<D | null> => {
    const result = await this.model.findById(id).select(this.projection).exec();
    return result ? this.toDomain(result) : null;
  };

  public update = async (id: string, entity: Partial<D>): Promise<D | null> => {
    const updatedEntity = await this.model
      .findByIdAndUpdate(id, entity as Partial<T>, { new: true })
      .select(this.projection)
      .exec();
    return updatedEntity ? this.toDomain(updatedEntity) : null;
  };

  public delete = async (id: string): Promise<D | null> => {
    const deletedEntity = await this.model
      .findByIdAndDelete({ _id: id })
      .select(this.projection)
      .exec();
    return deletedEntity ? this.toDomain(deletedEntity) : null;
  };

  public findOne = async (conditions: object): Promise<D | null> => {
    const result = await this.model
      .findOne(conditions)
      .select(this.projection)
      .exec();
    return result ? this.toDomain(result) : null;
  };

  public insertMany = async (entities: D[]): Promise<void> => {
    await this.model.insertMany(entities);
  };

  public findAll = async (conditions: object): Promise<D[]> => {
    const results = await this.model.find(conditions).select(this.projection);
    return results.map((res) => this.toDomain(res));
  };

  public parseId = (id: string): mongoose.Types.ObjectId => {
    return new mongoose.Types.ObjectId(id);
  };

  protected toDomain = (entity: T): D => {
    const { _id, __v, ...domainEntity } =
      entity instanceof mongoose.Document ? entity.toObject() : entity;

    return {
      ...domainEntity,
      id: _id.toString(),
    };
  };
}
