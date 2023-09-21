import { genSalt, hash, compare } from 'bcryptjs';

class PasswordUtils {
  static async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return await hash(password, salt);
  }

  static async validatePassword(
    password: string,
    savedPassword: string
  ): Promise<boolean> {
    return await compare(password, savedPassword);
  }
}

export default PasswordUtils;
