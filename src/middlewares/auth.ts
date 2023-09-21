import { Response, NextFunction } from 'express';
import { AuthRequest, JwtPayload } from '../interface';
import Jwt from '../utils/jwt';
import { Exception, asyncHandler } from '../helpers';

class AuthMiddleware {
  authorize(req: AuthRequest, res: Response, next: NextFunction) {
    let token;
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new Error('No bearer token provided');
    }

    if (authorization && authorization.startsWith('Bearer')) {
      token = authorization.split(' ')[1];
    } else if (req.cookies.access_token) {
      token = req.cookies.access_token;
    }

    try {
      req.user = Jwt.verifyToken(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
    } catch (err) {
      res.status(401);
      throw new Error(`Invalid Token`);
    }
    next();
  }

  authorizeRole(...roles: string[]) {
    if (typeof roles === 'string') {
      roles = [roles];
    }
    return asyncHandler(
      (req: AuthRequest, res: Response, next: NextFunction) => {
        if (roles.length && !roles.includes((req.user as JwtPayload).role)) {
          new Exception('Unauthorized to access this route', 401);
        }
        next();
      }
    );
  }
}

export default new AuthMiddleware();
