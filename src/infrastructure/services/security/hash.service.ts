import crypto from "crypto";
import { IHashService } from "@application/interfaces/security/IHash.service";

export class HashService implements IHashService {
  async generate(): Promise<string> {
    return crypto.randomBytes(32).toString("hex");
  }

  async hash(token: string): Promise<string> {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
}
