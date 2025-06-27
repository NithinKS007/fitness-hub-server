import { body } from "express-validator/lib";

export const videoSchema = [
   body("title")
    .isString()
    .withMessage("Title must be a string")
    .notEmpty()
    .withMessage("Title is required"),

  body("description")
    .isString()
    .withMessage("Description must be a string")
    .notEmpty()
    .withMessage("Description is required"),

   body("video")
    .isURL()
    .withMessage("Video URL must be a valid URL And must be a string")
    .notEmpty()
    .withMessage("Video URL is required"),
  
  body("duration")
    .isFloat({ min: 0 })
    .withMessage("Duration must be a positive integer")
    .notEmpty()
    .withMessage("Duration is required"),

  body("playLists")
    .isArray()
    .withMessage("Playlists must be an array of strings")
    .custom((value) => value.every((item: string) => typeof item === "string"))
    .withMessage("Each playlist item must be a string"),
  
  body("thumbnail")
    .isURL()
    .withMessage("Thumbnail must be a valid URL And must be a string")
    .notEmpty()
    .withMessage("Thumbnail is required"),
];
