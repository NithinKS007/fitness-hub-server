import express from "express"
import { authenticate } from "../middlewares/auth.middleware"
import expressAsyncHandler from "express-async-handler";
import { chatController } from "../../di/di";

const chatRoutes = express.Router()

//CHAT ROUTES
chatRoutes.get("/messages/:senderId/:receiverId", authenticate, expressAsyncHandler (chatController.getMessages.bind(chatController)))
chatRoutes.get("/trainer",authenticate,expressAsyncHandler(chatController.getTrainerChatList.bind(chatController)))
chatRoutes.get("/user",authenticate,expressAsyncHandler(chatController.getUserChatList.bind(chatController)))

export default chatRoutes