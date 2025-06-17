export interface IHashService {
  generate(): Promise<string>; 
  hash(token: string): Promise<string>; 
}
