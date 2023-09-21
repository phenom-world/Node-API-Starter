import http from 'http';
import { app } from './app';
import { logger } from './helpers';

const PORT = process.env.PORT || 80;

process.on('uncaughtException', (error) => {
  logger.error(`uncaught exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (err: Error, promise) => {
  logger.error(`Error ${err.message}`);
  server.close(() => process.exit(1));
});
const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(
    `server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
