import { sign, verify } from 'jsonwebtoken';

class JwtUtils {
  static generateAccessTokens(id?: string) {
    const accessToken = sign({ id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    const refreshToken = sign({ id }, process.env.JWT_SECRETII as string, {
      expiresIn: process.env.JWT_EXPIREII,
    });
    return { accessToken, refreshToken };
  }

  static generateToken(id: string) {
    return sign({ id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  }

  static verifyToken(token: string, config: string) {
    return verify(token, config);
  }
}

export default JwtUtils;
