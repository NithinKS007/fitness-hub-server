export enum JwtStatus {
  AuthHeaderMissing  = "The authentication header is missing. Please include the Authorization header with a valid token",
  NoRefreshToken = "Refresh token is missing. Please ensure you provide a valid refresh token.",
  InvalidRefreshToken = "The provided refresh token is invalid. Please login again or provide a valid token.",
  TokenRefreshSuccess = "Access token has been successfully refreshed. You can now proceed with the updated token.",
  InvalidAccessToken = "The access token is invalid. Please authenticate again to obtain a valid token.",
  NoAccessToken = "No access token provided. Please include a valid access token in your request.",
}
