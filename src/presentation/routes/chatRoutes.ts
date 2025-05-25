import express from "express"
import { authenticate } from "../middlewares/authenticate"
import expressAsyncHandler from "express-async-handler";
import { chatController } from "../../di/di";

const chatRoutes = express.Router()

//CHAT ROUTES
chatRoutes.get("/messages/:senderId/:receiverId", authenticate, expressAsyncHandler (chatController.getMessages))
chatRoutes.get("/trainer",authenticate,expressAsyncHandler(chatController.getTrainerChatList))
chatRoutes.get("/user",authenticate,expressAsyncHandler(chatController.getUserChatList))

export default chatRoutes