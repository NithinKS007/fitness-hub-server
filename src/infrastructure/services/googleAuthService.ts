import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import { AuthenticationStatusMessage } from "../../shared/constants/httpResponseStructure";
import { validationError } from "../../presentation/middlewares/errorMiddleWare";

dotenv.config();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (token: string) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (error) {
    throw new validationError(AuthenticationStatusMessage.GoogleAuthFailed);
  }
};
