export enum HttpStatusCodes {
    OK = 200,
    Created = 201,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    InternalServerError = 500,
  }
  
  export enum HttpStatusMessages {
    EmailConflict = "Email already exists",
    IncorrectPassword = "Invalid password for user",
    FailedToCreateUser = "Failed to create user. Please try again",
    UserCreatedSuccessfully = "User created successfully",
    AccountBlocked = "Your account has been blocked",
    EmailNotFound = "Email not found",
    LoginSuccessful = "Login successful",
    FailedToSignin = "Failed to sign in. Please try again",
    FailedToSendEmail = "Failed to send email"
  }
  