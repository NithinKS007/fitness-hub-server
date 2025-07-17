export interface GenerateToken {
  userId: string;
  roomId?: number;
  expiry?: number;
}

export enum ErrorCode {
  success = 0,
  appIDInvalid = 1,
  userIDInvalid = 3,
  secretInvalid = 5,
  effectiveTimeInSecondsInvalid = 6,
}

export const enum KPrivilegeKey {
  PrivilegeKeyLogin = 1,
  PrivilegeKeyPublish = 2,
}

export const enum KPrivilegeVal {
  PrivilegeEnable = 1,
  PrivilegeDisable = 0,
}

export interface ErrorInfo {
  errorCode: ErrorCode;
  errorMessage: string;
}
