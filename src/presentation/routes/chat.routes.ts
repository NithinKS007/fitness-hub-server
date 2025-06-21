import express from "express";
import { authenticate } from "@presentation/middlewares/auth.middleware";
import { asyncHandler } from "@shared/utils/async-handler";
import {
  getChatsController,
  getTrainerContactsController,
  getUserContactsController,
} from "@di/container-resolver";

const chatRoutes = express.Router();

//CHAT ROUTES
chatRoutes.get("/messages/:senderId/:receiverId",authenticate,asyncHandler(getChatsController.handle.bind(getChatsController)));
chatRoutes.get("/trainer",authenticate,asyncHandler(getTrainerContactsController.handle.bind(getTrainerContactsController)));
chatRoutes.get("/user",authenticate,asyncHandler(getUserContactsController.handle.bind(getUserContactsController)));

export default chatRoutes;
