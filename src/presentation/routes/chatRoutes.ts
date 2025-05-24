import express from "express"
import { authenticate } from "../middlewares/authenticate"
import { ChatController } from "../controllers/chat/chatController"
import expressAsyncHandler from "express-async-handler";

const chatRoutes = express.Router()

//CHAT ROUTES
chatRoutes.get("/messages/:senderId/:receiverId", authenticate, expressAsyncHandler (ChatController.getMessages))
chatRoutes.get("/trainer",authenticate,expressAsyncHandler(ChatController.getTrainerChatList))
chatRoutes.get("/user",authenticate,expressAsyncHandler(ChatController.getUserChatList))

export default chatRoutes