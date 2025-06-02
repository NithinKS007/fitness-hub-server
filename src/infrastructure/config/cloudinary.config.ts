import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { ApplicationStatus } from "../../shared/constants/index.constants";
import { validationError } from "../../presentation/middlewares/error.middleware";
dotenv.config();
interface CloudinaryConfig {
  CLOUDINARY_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}

const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env as unknown as CloudinaryConfig;

if (!CLOUDINARY_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new validationError(ApplicationStatus.MissingCloudinaryCredentials);
}

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export default cloudinary;
