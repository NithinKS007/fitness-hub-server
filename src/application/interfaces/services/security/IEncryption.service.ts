export interface IEncryptionService {
  hash(data: string): Promise<string>;
  compare(inputData: string, hashedData: string): Promise<boolean>;
}
