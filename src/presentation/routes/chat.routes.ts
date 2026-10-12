import express from "express";
import { authenticate } from "@presentation/middlewares/auth.middleware";
import { asyncHandler } from "@shared/utils/async-handler";
import {
  getChatsController,
  getTrainerContactsController,
  getUserContactsController,
} from "@di/container-resolver";
import { authorizeRole } from "@presentation/middlewares/autherisation.middleware";

const router = express.Router();
router.use(authenticate);

//CHAT ROUTES
router.get("/chats/messages/:senderId/:receiverId",authorizeRole(["user","trainer"]),asyncHandler(getChatsController.handle.bind(getChatsController)));
router.get("/chats/trainer",authorizeRole(["trainer"]),asyncHandler(getTrainerContactsController.handle.bind(getTrainerContactsController)));
router.get("/chats/user",authorizeRole(["user"]),asyncHandler(getUserContactsController.handle.bind(getUserContactsController)));

export default router;
