import winston, { createLogger, format, transports } from 'winston';
import  DailyRotateFile from 'winston-daily-rotate-file';


const transportDailyRotateFile: DailyRotateFile = new DailyRotateFile({
  filename: 'logs/koa-prisma-ts/app-combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '1m',
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'DD-MM-YYYY HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    new transports.File({ filename: 'logs/app-error.log', level: 'error' }),
    // new transports.File({ filename: 'logs/KOA-PRISMA-TS/app-combined.log' }),
    transportDailyRotateFile
  ]
});

export default logger;