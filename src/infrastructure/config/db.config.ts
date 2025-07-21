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
      await mongoose.connect(this.uri);
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      process.exit(1);
    }
  }
}
