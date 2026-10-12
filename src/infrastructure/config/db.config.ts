import mongoose from "mongoose";
import dotenv from "dotenv";
import { IConnectDB } from "@domain/interfaces/IConnectdb";
import { DatabaseError } from "@presentation/middlewares/error.middleware";
import { injectable } from "inversify";
dotenv.config();

@injectable()
export class ConnectDB implements IConnectDB {
  constructor(private uri = process.env.COMPASS_DATABASE_CONFIG) {
    this.uri = uri;
  }

  async connectMongo(): Promise<void> {
    if (!this.uri) {
      throw new DatabaseError(
        "Database URI is not defined in environment variables"
      );
    }
    try {
      await mongoose.connect(this.uri, {
        maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE ?? 20),
        minPoolSize: Number(process.env.MONGO_MIN_POOL_SIZE ?? 5),
        serverSelectionTimeoutMS: 10_000,
        socketTimeoutMS: 45_000,
      });
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw new DatabaseError("Unable to connect to MongoDB");
    }
  }

  async disconnectMongo(): Promise<void> {
    await mongoose.disconnect();
  }
}
