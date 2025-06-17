import bcrypt from "bcrypt";
import { IEncryptionService } from "@application/interfaces/security/IEncryption.service";

export class EncryptionService implements IEncryptionService {
  private saltRounds: number = 10;
  async hash(data: string): Promise<string> {
    return await bcrypt.hash(data, this.saltRounds);
  }

  async compare(inputData: string, hashedData: string): Promise<boolean> {
    return await bcrypt.compare(inputData, hashedData);
  }
}
