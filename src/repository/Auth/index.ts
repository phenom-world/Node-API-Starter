import { User } from '@prisma/client';
import prisma from '../../config/prisma';
import Utils from '../../utils';
import dayjs from 'dayjs';

class AuthRepository {
  async createUser(data: Omit<User, 'id'>): Promise<User> {
    const token = Utils.tokenGenerator();
    const user = await prisma.user.create({
      data: {
        ...data,
        tokens: {
          create: [
            {
              token,
              type: 'CONFIRMATION_EMAIL',
              expires: dayjs().add(1, 'd').toDate(),
            },
          ],
        },
      },
    });
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email } });
  }
}

export default new AuthRepository();
