import { Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const mode = process.env.NODE_ENV === "PRODUCTION";

export const setRefreshTokenCookie = (
  res: Response,
  refreshToken: string
): void => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: mode ? "none" : "strict",
    secure: mode,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: mode ? "none" : "strict",
    secure: mode,
  });
};
