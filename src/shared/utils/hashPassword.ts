import bcrypt from "bcrypt";
import { PasswordStatus } from "../constants/index-constants";
import { validationError } from "../../presentation/middlewares/errorMiddleWare";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds: number = 10;
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.log(`Error hashing password: ${error}`);
    throw new validationError(PasswordStatus.FailedToHashPassword);
  }
};

export const comparePassword = async (
  userPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(userPassword, hashedPassword);
  } catch (error) {
    console.log(`Error while comparing the passwords: ${error}`);
    throw new validationError(PasswordStatus.FailedToComparePassword);
  }
};
