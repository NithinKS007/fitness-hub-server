export enum JwtStatus {
  AuthHeaderMissing  = "Authentication header is missing",
  NoRefreshToken = "No refresh token",
  InvalidRefreshToken = "Invalid refresh token",
  TokenRefreshSuccess = "Access Token refreshed successfully",
  InvalidAccessToken = "Invalid access token",
  NoAccessToken = "No access Token",
}
