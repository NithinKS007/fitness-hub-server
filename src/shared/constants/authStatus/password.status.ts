export enum PasswordStatus {
  HashFailed = "Failed to hash password",
  CompareFailed = "Failed to compare password",
  Updated = "Password updated successfully",
  LinkExpired = "Link expired.",
  ResetSuccess = "Your password has been successfully reset. You can now log in with your new password",
  Incorrect = "The password you entered is incorrect for this user.",
}
