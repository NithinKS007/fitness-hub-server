import { Subscription } from "./subscriptionEntity";
import { User } from "./userEntity";

export interface TrainerWithSubscription extends User {
    trainerSubscriptionData:Subscription[]
}
