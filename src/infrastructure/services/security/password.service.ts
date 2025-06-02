import bcrypt from "bcrypt";
import { IPasswordService } from "../../../application/interfaces/security/IPassword.service";
import { PasswordStatus } from "../../../shared/constants/authStatus/password.status";
import { validationError } from "../../../presentation/middlewares/error.middleware";

export class PasswordService implements IPasswordService {
  private saltRounds: number = 10;
  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      console.log(`Error hashing password: ${error}`);
      throw new validationError(PasswordStatus.FailedToHashPassword);
    }
  }

  async comparePassword(
    userPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(userPassword, hashedPassword);
    } catch (error) {
      console.log(`Error while comparing the passwords: ${error}`);
      throw new validationError(PasswordStatus.FailedToComparePassword);
    }
  }
}
