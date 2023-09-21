import { Router } from 'express';
import AuthValidator from '../validators/user';
import { AuthController } from '../controllers';
import Validator from '../middlewares/validator';

const router = Router();

router
  .route('/register')
  .post(
    Validator.validate(AuthValidator.register()),
    AuthController.register()
  );
router
  .route('/login')
  .post(Validator.validate(AuthValidator.login()), AuthController.login());

export default router;
