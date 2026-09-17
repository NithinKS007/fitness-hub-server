export interface IBaseRepository<T, D> {
  create(entity: Partial<D>): Promise<D>;
  findById(id: string): Promise<D | null>;
  update(id: string, entity: Partial<D>): Promise<D | null>;
  delete(id: string): Promise<D | null>;
  findOne(query: Partial<D>): Promise<D | null>;
  insertMany(entities: D[]): Promise<void>;
  toDomain(entity: T): D;
}
