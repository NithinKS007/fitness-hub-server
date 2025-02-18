import crypto from "crypto";

export const generateToken = async ():Promise<string> => {
  return crypto.randomBytes(32).toString("hex");
};
export const hashToken = async (token: string): Promise<string> => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
