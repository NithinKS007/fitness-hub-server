import { Server, Socket } from 'socket.io';
import { validationError } from '../../interfaces/middlewares/errorMiddleWare';
import { VideoCallUseCase } from '../../application/usecases/videoCallUseCase';
import { ChatUseCase } from '../../application/usecases/chatUseCase';
import { TrainerUseCase } from '../../application/usecases/trainerUseCase';
import { MongoTrainerRepository } from '../databases/repositories/mongoTrainerRepository';
import { BookingSlotUseCase } from '../../application/usecases/bookingSlotUseCase';
import { MongoAppointmentRepository } from '../databases/repositories/mongoAppointmentRepository';
import { MongoBookingSlotRepository } from '../databases/repositories/mongoBookingSlotRepository';
import { MongoChatRepository } from '../databases/repositories/mongoChatRepository';
import { MongoVideoCallLogRepository } from '../databases/repositories/mongoVideoCallLogRepository';


//MONGO REPOSITORY INSTANCES
const mongoChatRepository = new MongoChatRepository()
const mongoVideoCallLogRepository = new MongoVideoCallLogRepository()
const mongoTrainerRepository = new MongoTrainerRepository()
const mongoAppointmentRepository = new MongoAppointmentRepository()
const mongoBookingSlotRepository = new MongoBookingSlotRepository()

//USE CASE INSTANCES
const trainerUseCase = new TrainerUseCase(mongoTrainerRepository)
const chatUseCase = new ChatUseCase(mongoChatRepository)
const videoCallLogUseCase = new VideoCallUseCase(mongoVideoCallLogRepository)
const bookingSlotUseCase = new BookingSlotUseCase(mongoBookingSlotRepository,mongoAppointmentRepository,mongoVideoCallLogRepository)

export const chatSocket =  (io:Server) =>{

    io.on("connection",(socket:Socket)=>{
      console.log(`socket id connected: ${socket.id}`);
      socket.on("error", (error) => {
          console.log("Socket error: ", error);
          socket.emit("error", { message: "Something went wrong. Please try again." });
        });

      //video call events management
      socket.on("initiateVideoCall",async({callerId,receiverId,roomId,appointmentId})=>{
        console.log(`Video call initiated by ${callerId} to ${receiverId} in room ${roomId}`);
        const trainerData = await trainerUseCase.getTrainerDetailsById(callerId)
        const appointmentData = await bookingSlotUseCase.getAppointmentById(appointmentId)

        if(appointmentData?.status==="cancelled"){

           throw new validationError("Failed to connnect")
        }
        console.log("trainer data for calling",trainerData)
        const trainerName = `${trainerData.fname} ${trainerData.lname}`
        const appointmentTime = appointmentData?.appointmentTime
        const appointmentDate = appointmentData?.appointmentDate
        await videoCallLogUseCase.createVideoCallLog({callerId:callerId,receiverId:receiverId,callRoomId:roomId,appointmentId:appointmentId,callStartTime:new Date()})
        io.to(receiverId).emit("incomingCall",{trainerName,appointmentTime,appointmentDate,callerId,roomId,appointmentId})
      })

      socket.on('acceptVideoCall', async ({ roomId, userId }) => {
        console.log(`${userId} accepted call in room ${roomId}`);
        socket.join(roomId);
        io.to(roomId).emit('callStarted', { roomId });
      })

      socket.on('rejectVideoCall', async ({ roomId }) => {
        console.log(`Call rejected for room ${roomId}`);

        const endTime = new Date()
        const videoCallLogData =  await videoCallLogUseCase.updateVideoCallLog({callRoomId:roomId,callEndTime: endTime, callStatus:'missed' })
        if (videoCallLogData?.callStartTime && videoCallLogData?.callEndTime) {
          const duration = Math.floor((videoCallLogData.callEndTime.getTime() - videoCallLogData.callStartTime.getTime()) / 1000);
          await videoCallLogUseCase.updateVideoCallDuration({ callRoomId: roomId, callDuration: duration });
        } else {
          console.error(`Failed to calculate duration for ${roomId}: Missing start or end time`);
        }
        io.to(roomId).emit('callEnded');
      });

      socket.on('videoCallEnded',async ({ roomId })=>{
        console.log(`Call ended in room ${roomId}`);
        const endTime = new Date()
        const videoCallLogData = await videoCallLogUseCase.updateVideoCallLog({callRoomId:roomId,callEndTime:endTime,callStatus:'completed'})
        if (videoCallLogData?.callStartTime && videoCallLogData?.callEndTime) {
          const duration = Math.floor((videoCallLogData.callEndTime.getTime() - videoCallLogData.callStartTime.getTime()) / 1000);
          await videoCallLogUseCase.updateVideoCallDuration({ callRoomId: roomId, callDuration: duration });
        } else {
          console.error(`Failed to calculate duration for ${roomId}: Missing start or end time`);
        }
        io.to(roomId).emit('callEnded');
      })

      //chat event management
      socket.on("join", (userId: string) => {
        socket.join(userId);
        console.log(`User ${userId} joined room ${userId}`);
      })

      try {
        socket.on("sendMessage",async({senderId,receiverId, message})=>{
        console.log('Received message:',senderId,receiverId, message);
          const savedMessage =  await chatUseCase.sendMessageAndSave({senderId,receiverId, message})
            io.to(receiverId).emit("receiveMessage", {
                _id:savedMessage._id,
                senderId: senderId,
                message: message,
                createdAt:savedMessage?.createdAt 
              });
          })
      } catch (error) {
        console.log('Error sending message:', error);
        socket.emit("error", { message: "Failed to send message. Please try again." });
      }
        
      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        });
     })

}