import express from "express"
import { authenticate } from "../middlewares/authenticate"
import expressAsyncHandler from "express-async-handler"
import { appointmentController, authController, bookingController, playListController, purchaseSubscriptionController, trainerDisplayController, userDashBoardController, userSubscriptionController, videoCallLogController, videoController, webhookController, workoutController } from "../../di/di"

const userRoutes = express.Router()

//TRAINER DISPLAYING ROUTES
userRoutes.get("/trainers",expressAsyncHandler(trainerDisplayController.getApprovedTrainers))
userRoutes.get("/trainers/:trainerId",expressAsyncHandler(trainerDisplayController.getApprovedTrainerDetailsWithSub))
userRoutes.get("/my-trainers",authenticate,expressAsyncHandler(trainerDisplayController.getMyTrainers))

//SUBSCRIPTION ROUTES
userRoutes.post("/subscriptions/checkout",authenticate,expressAsyncHandler(purchaseSubscriptionController.purchaseSubscription))
userRoutes.get("/subscriptions",authenticate,expressAsyncHandler(userSubscriptionController.getUserSubscriptions))
userRoutes.get("/subscriptions/verify/:sessionId",authenticate,expressAsyncHandler(webhookController.getSubscriptionBySession))
userRoutes.patch("/subscriptions/cancel",authenticate,expressAsyncHandler(purchaseSubscriptionController.cancelSubscription)) 
userRoutes.get("/subscriptions/status/:_id",authenticate,expressAsyncHandler(userSubscriptionController.isSubscribedToTheTrainer))

//VIDEO ROUTES
userRoutes.get("/trainer/videos/:trainerId",authenticate,expressAsyncHandler(videoController.getPublicVideos))
userRoutes.get("/videos/:videoId",authenticate,expressAsyncHandler(videoController.getVideoById))

//PLAYLIST ROUTES
userRoutes.get("/playlists/all/:trainerId",authenticate,expressAsyncHandler(playListController.getallPlayLists))

//BOOKING ROUTES
userRoutes.get("/slots/all/:trainerId",authenticate,expressAsyncHandler(bookingController.getAllAvailableSlotsFromToday))
userRoutes.get("/slots/:trainerId",authenticate,expressAsyncHandler(bookingController.getAvailableSlotsFromToday))
userRoutes.post("/slots/:slotId",authenticate,expressAsyncHandler(appointmentController.bookAppointment))

//APPOINTMENT ROUTES
userRoutes.get("/appointments",authenticate,expressAsyncHandler(appointmentController.getUserBookingSchedules))
userRoutes.patch("/appointments/:appointmentId",authenticate,expressAsyncHandler(appointmentController.cancelAppointment))
userRoutes.get("/video-call-logs",authenticate,expressAsyncHandler(videoCallLogController.getUserVideoCallLogs))

//PROFILE ROUTES
userRoutes.put("/profile",authenticate,expressAsyncHandler(authController.updateUserProfile))

//WORKOUT ROUTES
userRoutes.post("/workouts",authenticate,expressAsyncHandler(workoutController.addWorkout))
userRoutes.get("/workouts",authenticate,expressAsyncHandler(workoutController.getWorkoutsByUserId))
userRoutes.delete("/workouts/:setId",authenticate,expressAsyncHandler(workoutController.deleteWorkoutSet))
userRoutes.patch("/workouts/:setId",authenticate,expressAsyncHandler(workoutController.markSetAsCompleted))

//DASHBOARD ROUTES
userRoutes.get("/dashBoard",authenticate,expressAsyncHandler(userDashBoardController.getUserDashBoardData))


export default userRoutes

