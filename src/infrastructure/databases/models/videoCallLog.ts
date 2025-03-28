import mongoose, { Schema, Document } from "mongoose";

interface IVideoCallLog extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  appointmentId: mongoose.Schema.Types.ObjectId;
  callerId:  mongoose.Schema.Types.ObjectId
  receiverId:  mongoose.Schema.Types.ObjectId
  callDuration: number;
  callRoomId :string
  callStatus: 'pending'|'completed' | 'missed' 
  callStartTime: Date;
  callEndTime: Date;
}

const videoCallLogSchema: Schema = new Schema(
  {
    appointmentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Appointment' },
    callerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Trainer' },
    callDuration: { type: Number,default:0},
    callRoomId: {type:String},
    callStatus: { type: String, enum: ['pending', 'completed' , 'missed' ], default: 'pending' },
    callStartTime: { type: Date},
    callEndTime: { type: Date},
  },
  { timestamps: true }
);

const videoCallLogModel = mongoose.model<IVideoCallLog>("VideoCallLog", videoCallLogSchema);

export default videoCallLogModel;
