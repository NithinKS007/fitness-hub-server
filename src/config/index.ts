import dotenv from "dotenv";
import app from "../server";
import connectDB from "../infrastructure/config/dbConfig";
import { JwtPayload } from "jsonwebtoken";;
import { Server } from "socket.io";
import { chatSocket } from "../infrastructure/services/socketService"
import { createServer } from "http";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

dotenv.config();
connectDB();

const allowedOrigins = process.env.CLIENT_ORIGINS;
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

chatSocket(io)

const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
  if (!PORT) {
    console.error("PORT is not defined in .env file");
    process.exit(1);
  }
  console.log(`Server running on port ${process.env.PORT}`);
});
