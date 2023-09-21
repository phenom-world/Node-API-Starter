import { nanoid } from 'nanoid';

class Utils {
  static tokenGenerator() {
    return nanoid(20);
  }
}

export default Utils;
