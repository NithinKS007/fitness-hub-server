import { Response } from "express";

export const sendResponse = ( res: Response,statusCode: number,data: any,message: string) => {
  const success = statusCode >= 200 && statusCode < 300

  // console.log("Response being sent:", {
  //   success,
  //   status: statusCode,
  //   message: message,
  //   data,
  // });
  const response = {
    success,
    status: statusCode,
    message: message,
    data,
  };

  return res.status(statusCode).json(response);
};