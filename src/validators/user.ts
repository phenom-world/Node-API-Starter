import Joi from 'joi';

class AuthValidator {
  static register() {
    return Joi.object({
      firstName: Joi.string().min(5).max(50).required(),
      lastName: Joi.string().min(5).max(50).required(),
      email: Joi.string().min(5).max(255).email().required(),
      password: Joi.string().min(5).max(255).required(),
    });
  }

  static login() {
    return Joi.object({
      email: Joi.string().min(5).max(255).email().required(),
      password: Joi.string().min(5).max(255).required(),
    });
  }

  static forgotPassword() {
    return Joi.object({
      email: Joi.string().min(5).max(255).email().required(),
    });
  }

  static resetPassword() {
    return Joi.object({
      token: Joi.string().required(),
      password: Joi.string().min(5).max(255).required(),
    });
  }
}

export default AuthValidator;
