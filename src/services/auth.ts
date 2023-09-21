import { AuthServiceType, LoginResponse, SignUpResponse } from '../interface';
import { User } from '@prisma/client';
import { AuthRepository } from '../repository';
import { Exception } from '../helpers';
import Jwt from '../utils/jwt';
import PasswordUtils from '../utils/password';

class AuthService implements AuthServiceType {
  async register(body: Omit<User, 'id'>): Promise<SignUpResponse> {
    let user = await AuthRepository.findByEmail(body.email);
    if (user) {
      new Exception('user already exists', 400);
    }

    body.password = await PasswordUtils.hashPassword(body.password);
    user = await AuthRepository.createUser(body);
    const { accessToken, refreshToken } = Jwt.generateAccessTokens(user.id);
    if (user.password) {
      // @ts-ignore
      delete user.password;
    }
    return { ...user, accessToken, refreshToken };
  }

  async login(data: Pick<User, 'email' | 'password'>): Promise<LoginResponse> {
    const user = await AuthRepository.findByEmail(data.email);
    if (!user) {
      throw new Exception('invalid username and password', 401);
    }
    const isPasswordValid = await PasswordUtils.validatePassword(
      data.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Exception('invalid username and password', 401);
    }
    if (user.password) {
      // @ts-ignore
      delete user.password;
    }
    const { accessToken, refreshToken } = Jwt.generateAccessTokens(user.id);
    return { ...user, accessToken, refreshToken };
  }

  async logout(): Promise<void> {
    return;
  }
}

export default AuthService;
