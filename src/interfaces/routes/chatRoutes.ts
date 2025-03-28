import express from "express"
import { authenticate } from "../middlewares/authenticate"
import { ChatController } from "../controllers/chatController"
const chatRoutes = express.Router()

//CHAT ROUTES
chatRoutes.get("/get-chat/:senderId/:receiverId", authenticate, ChatController.getMessages)

export default chatRoutes