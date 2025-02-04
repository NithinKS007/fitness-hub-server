import dotenv from "dotenv";
import app from "../server";
import connectDB from "../infrastructure/config/db";

dotenv.config();
connectDB()
const PORT =  process.env.PORT

app.listen(PORT, () => {
  if (!PORT) {
    console.error("PORT is not defined in .env file");
    process.exit(1);
  }
  console.log(`Server running on port ${process.env.PORT}`);
});
