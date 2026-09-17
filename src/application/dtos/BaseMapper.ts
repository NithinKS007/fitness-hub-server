export abstract class BaseMapper<T, D> {
  abstract map(data: T): D;
}
