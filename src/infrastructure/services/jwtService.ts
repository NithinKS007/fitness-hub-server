import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as any;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION as any ;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as any;
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION as any;

export const generateAccessToken = (id: string, role: string):string=> {
  const payload = { id: id, role: role,}
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

};
export const generateRefreshToken = (id: string, role: string): string => {
  const payload = { id: id, role: role}
  return jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: JWT_REFRESH_EXPIRATION});
};

export const authenticateAccessToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET) 
};
  
export const authenticateRefreshToken = (token: string) => {
    return jwt.verify(token, JWT_REFRESH_SECRET) 
};