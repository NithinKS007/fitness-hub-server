import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION!;

export const generateAccessToken = (id: string, role: string):string=> {
  const payload = { id: id, role: role,}

  const options:jwt.SignOptions = { expiresIn: Number(JWT_EXPIRATION) }
  return jwt.sign(payload, JWT_SECRET, options)
};

export const generateRefreshToken = (id: string, role: string): string => {
  const payload = { id: id, role: role}
  const options:jwt.SignOptions = { expiresIn: Number(JWT_REFRESH_EXPIRATION) }
  return jwt.sign(payload, JWT_REFRESH_SECRET, options);
};

export const authenticateAccessToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET) 
};
  
export const authenticateRefreshToken = (token: string) => {
    return jwt.verify(token, JWT_REFRESH_SECRET) 
};