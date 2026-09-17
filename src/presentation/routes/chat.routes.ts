import express from "express";
import { authenticate } from "@presentation/middlewares/auth.middleware";
import { asyncHandler } from "@shared/utils/async-handler";
import {
  getChatsController,
  getTrainerContactsController,
  getUserContactsController,
} from "@di/container-resolver";
import { authorizeRole } from "@presentation/middlewares/autherisation.middleware";

const chatRoutes = express.Router();
chatRoutes.use(authenticate);

//CHAT ROUTES
chatRoutes.get("/messages/:senderId/:receiverId",authorizeRole(["user","trainer"]),asyncHandler(getChatsController.handle.bind(getChatsController)));
chatRoutes.get("/trainer",authorizeRole(["trainer"]),asyncHandler(getTrainerContactsController.handle.bind(getTrainerContactsController)));
chatRoutes.get("/user",authorizeRole(["user"]),asyncHandler(getUserContactsController.handle.bind(getUserContactsController)));

export default chatRoutes;
