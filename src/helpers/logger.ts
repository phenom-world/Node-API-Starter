import winston, { Logger as Winston } from 'winston';

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

export class Logger {
  private logger: Winston;
  constructor(name: string) {
    this.logger = winston.createLogger({
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
      format: winston.format.combine(
        enumerateErrorFormat(),
        process.env.NODE_ENV === 'development'
          ? winston.format.colorize()
          : winston.format.uncolorize(),
        winston.format.splat(),
        winston.format.printf(
          ({ level, message }: { level: string; message: string }) =>
            `${level}: ${message}`
        )
      ),
      defaultMeta: { service: name },
      transports: [
        new winston.transports.File({
          filename: './logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.metadata(),
            winston.format.json()
          ),
        }),
        new winston.transports.File({
          filename: './logs/combined.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.metadata(),
            winston.format.json()
          ),
        }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          stderrLevels: ['error', 'warn'],
        })
      );
    }
  }
  debug(log: string, metadata?: any) {
    this.logger.debug(log, metadata);
  }

  info(log: string, metadata?: any) {
    this.logger.info(log, metadata);
  }

  error(log: string, metadata?: any) {
    this.logger.error(log, metadata);
  }

  warn(log: string, metadata?: any) {
    this.logger.warn(log, metadata);
  }

  log(level: 'info' | 'error' | 'warn' | 'debug', log: string, metadata?: any) {
    const metadataObject: any = {};

    if (metadata) metadataObject.metadata = metadata;
    this.logger[level](log, metadata);
  }
}

export const logger = new Logger('root');

export default logger;
