export enum ApplicationStatus {
  InternalServerError = "An internal server error occurred. Please try again later.",
  TooManyRequests = "Too many requests. Please try again later.",
  ResourceNotFound = "The resource was not found.",
  FailedToUploadToCloudinary = "Failed to upload data to Cloudinary.",
  MissingEmailEnvironmentVariables = "Missing required email environment variables",
  MissingCloudinaryCredentials = "Missing required cloudinary environment variables",
  MissingJwtEnvironmentVariables = "Missing required jwt environment variables",
  AllFieldsAreRequired = "Please ensure that all required fields are filled in before submitting the form.",
}
