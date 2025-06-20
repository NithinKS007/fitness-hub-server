import express from "express";
import { authenticate } from "@presentation/middlewares/auth.middleware";
import { asyncHandler } from "@shared/utils/async-handler";
import { chatController } from "di/container-resolver";

const chatRoutes = express.Router();

//CHAT ROUTES
chatRoutes.get(
  "/messages/:senderId/:receiverId",
  authenticate,
  asyncHandler(chatController.getMessages.bind(chatController))
);
chatRoutes.get(
  "/trainer",
  authenticate,
  asyncHandler(chatController.getTrainerChatList.bind(chatController))
);
chatRoutes.get(
  "/user",
  authenticate,
  asyncHandler(chatController.getUserChatList.bind(chatController))
);

export default chatRoutes;
