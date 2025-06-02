export interface ITokenService {
  generateToken(): Promise<string>; 
  hashToken(token: string): Promise<string>; 
}
