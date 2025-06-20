export enum PasswordStatus {
  HashFailed = "An error occurred while hashing the password. Please try again.",
  CompareFailed = "Failed to compare passwords. Please check the entered details.",
  Updated = "Your password has been updated successfully. You can now use your new password.",
  LinkExpired = "The password reset link has expired. Please request a new one.",
  ResetSuccess = "Your password has been successfully reset. You can now log in with your new password",
  Incorrect = "The password you entered is incorrect. Please try again",
}
