import { Socket } from "socket.io";
import {
  checkUserBlockStatusUseCase,
  tokenUseCase,
} from "@di/container-resolver";
import {
  AppError,
  ForbiddenError,
  UnauthorizedError,
} from "@presentation/middlewares/error.middleware";
import {
  AuthStatus,
  JwtStatus,
  StatusCodes,
} from "@shared/constants/index.constants";

const handleError = (socket: Socket, error: AppError) => {
  const statusCode =
    error instanceof AppError ? error.statusCode : StatusCodes.Unauthorized;
  const errorMessage =
    error instanceof AppError ? error.message : JwtStatus.NoAccessToken;
  console.log("Socket Error Message: ", errorMessage);
  console.log("Socket Error Code : ", statusCode);
  socket.emit("authError", {
    statusCode: statusCode,
    message: errorMessage,
  });
};

export const socketAuth = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    const accessToken = socket.handshake.auth.accessToken;

    if (!accessToken) {
      console.log("no access token in middleware");
      next(new UnauthorizedError(JwtStatus.NoAccessToken));
      return;
    }
    const decoded = await tokenUseCase.validateToken(accessToken);
    const { _id } = decoded;

    if (!_id) {
      console.log("invalid access token in middleware");
      next(new UnauthorizedError(JwtStatus.InvalidAccessToken));
      return;
    }

    socket.user = decoded;
    const isBlocked = await checkUserBlockStatusUseCase.execute(_id);
    if (isBlocked) {
      console.log("User is blocked in socket middleware");
      next(new ForbiddenError(AuthStatus.AccountBlocked));
      return;
    }
    console.log("Authentication successful in socket");
    return next();
  } catch (error: any) {
    handleError(socket, error);
  }
};
