import express from "express";
import workoutRoutes from "./workouts.routes"
import appointmentRoutes from "./appointment.routes"
import slotRoutes from "./slot.routes"
import videoCallRoutes from "./video-call.routes"
import videoRoutes from "./video.routes"
import playlistRoutes from "./playlist.routes"
import zegoCloudRoutes from "./zego-cloud.routes"
import cloudinaryRoutes from "./cloudinary.routes"
import chatRoutes from "./chat.routes"
import subscriptionRoutes from "./subscription.routes"
import userRoutes from "./user.routes"
import authRoutes from "./auth.routes"
const router = express.Router();

router.use("/v1",workoutRoutes)
router.use("/v1",appointmentRoutes)
router.use("/v1",slotRoutes)
router.use("/v1",videoCallRoutes)
router.use("/v1",videoRoutes)
router.use("/v1",playlistRoutes)
router.use("/v1",zegoCloudRoutes)
router.use("/v1",cloudinaryRoutes)
router.use("/v1",chatRoutes)
router.use("/v1",subscriptionRoutes)
router.use("/v1",userRoutes)
router.use("/v1",authRoutes)

export default router