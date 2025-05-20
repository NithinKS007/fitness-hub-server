export enum JwtStatus {
  AuthenticationHeaderIsMissing = "Authentication header is missing",
  NoRefreshToken = "No refresh token",
  InvalidRefreshToken = "Invalid refresh token",
  AccessTokenRefreshedSuccessFully = "Access Token refreshed successfully",
  InvalidAccessToken = "Invalid access token",
  NoAccessToken = "No access Token",
}
