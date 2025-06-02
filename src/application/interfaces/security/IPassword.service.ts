export interface IPasswordService {
  hashPassword(password: string): Promise<string>;
  comparePassword(
    userPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}
