import { logger } from '../helpers';
import prisma from './prisma';

const connectDb = async () => {
  try {
    const currentDb =
      await prisma.$queryRaw`SELECT current_database() as db_name`;
    if (
      currentDb &&
      typeof currentDb === 'object' &&
      Array.isArray(currentDb)
    ) {
      logger.info(`Connected to ${currentDb[0].db_name} database 🔗`);
    }
  } catch (err) {
    logger.error('Error connecting to database❌', err);
    await prisma.$disconnect();
  }
};

export default connectDb;
