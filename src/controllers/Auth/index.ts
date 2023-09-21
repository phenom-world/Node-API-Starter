import { Request, Response } from 'express';
import JwtUtils from '../../utils/jwt';
import { Exception, asyncHandler } from '../../helpers';
import { AuthService } from '../../services';
import { JwtPayload } from '../../interface';
import { cookieOptions } from '../../config';
import dayjs from 'dayjs';

class AuthController {
  constructor(private readonly authService: AuthService) {}
  setCookie(
    name: 'access_token' | 'refresh_token',
    res: Response,
    token: string
  ) {
    res.cookie(name, token, {
      ...cookieOptions,
      expires:
        name === 'access_token'
          ? dayjs().add(1, 'day').toDate()
          : dayjs().add(30, 'day').toDate(),
    });
  }

  register() {
    return asyncHandler(async (req: Request, res: Response) => {
      const user = await this.authService.register(req.body);
      this.setCookie('access_token', res, user.accessToken);
      this.setCookie('refresh_token', res, user.accessToken);
      res.status(201).json({ data: user, status: true });
    });
  }

  login() {
    return asyncHandler(async (req: Request, res: Response) => {
      let user = await this.authService.login(req.body);
      this.setCookie('access_token', res, user.accessToken);
      this.setCookie('refresh_token', res, user.accessToken);
      res.status(200).json({ ...user });
    });
  }

  refreshToken() {
    return asyncHandler(async (req: Request, res: Response) => {
      let { refreshToken } = req.body;
      const user = JwtUtils.verifyToken(
        refreshToken,
        process.env.JWT_SECRETII as string
      ) as JwtPayload;

      if (!user) {
        throw new Exception('Invalid refresh token');
      }
      const token = JwtUtils.generateToken(user?.id);
      this.setCookie('access_token', res, token);
      res.status(200).json({ accessToken: token });
    });
  }

  signOut() {
    return asyncHandler(async (req, res) => {
      res.clearCookie('access_token', cookieOptions);
      res.clearCookie('refresh_token', cookieOptions);
      return res.status(200).json({ message: 'You successfully logged out' });
    });
  }
}

export default new AuthController(new AuthService());
