export interface IBaseUseCase<TDtos, TResponse> {
  execute(dto: TDtos): Promise<TResponse>;
}
