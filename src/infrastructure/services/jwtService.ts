import jwt from "jsonwebtoken";
import ms from "ms";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION 
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION 

if (!JWT_SECRET || !JWT_EXPIRATION || !JWT_REFRESH_SECRET || !JWT_REFRESH_EXPIRATION) {
  throw new validationError(HttpStatusMessages.MissingJwtEnvironmentVariables);
}

export const generateAccessToken = (_id: string, role: string):string=> {
  const payload = { _id: _id, role: role,}
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION as ms.StringValue}) 

};
export const generateRefreshToken = (_id: string, role: string): string => {
  const payload  = { _id: _id, role: role}
  return jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: JWT_REFRESH_EXPIRATION as ms.StringValue});
};

export const authenticateAccessToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET) 
 
};
  
export const authenticateRefreshToken = (token: string) => {
    return jwt.verify(token, JWT_REFRESH_SECRET) 
  
};