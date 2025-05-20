import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  const uri: string = process.env.ATLAS_DATABASE_CONFIG!;
  if (!uri) {
    console.error("Database URI is not defined in environment variables");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
