import express from "express"
import { SubscriptionController } from "../../application/controllers/subscriptionController"
import { authenticate } from "../middlewares/authenticate"
const trainerRoutes = express.Router()

trainerRoutes.post("/add-subscription",authenticate,SubscriptionController.addSubscription)
trainerRoutes.get("/subscriptions",authenticate,SubscriptionController.getTrainerSubscriptions)
trainerRoutes.patch("/subscriptions/:_id",authenticate,SubscriptionController.updateSubscriptionBlockStatus)
trainerRoutes.put("/subscriptions/:_id",authenticate,SubscriptionController.editSubscription)
trainerRoutes.delete("/subscriptions/:_id",authenticate,SubscriptionController.deleteSubscription)


export default trainerRoutes