import winston from 'winston';
import { LogLevel, LogContext } from '../types';
import { appConfig, paths } from '../config';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: appConfig.logLevel,
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: `${paths.logs}/error.log`,
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: `${paths.logs}/combined.log`,
      maxsize: 5242880, // 5MB
      maxFiles: 10
    })
  ]
});

// Add console transport for development
if (appConfig.nodeEnv !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatMessage(message: string, context?: LogContext): any {
    return {
      message,
      service: this.context,
      ...context,
      timestamp: new Date().toISOString()
    };
  }

  error(message: string, context?: LogContext): void {
    logger.error(this.formatMessage(message, context));
  }

  warn(message: string, context?: LogContext): void {
    logger.warn(this.formatMessage(message, context));
  }

  info(message: string, context?: LogContext): void {
    logger.info(this.formatMessage(message, context));
  }

  debug(message: string, context?: LogContext): void {
    logger.debug(this.formatMessage(message, context));
  }

  logOperation<T>(
    operation: string,
    fn: () => Promise<T>,
    context?: LogContext
  ): Promise<T> {
    return this.executeWithLogging(operation, fn, context);
  }

  private async executeWithLogging<T>(
    operation: string,
    fn: () => Promise<T>,
    context?: LogContext
  ): Promise<T> {
    const startTime = Date.now();
    this.info(`Starting ${operation}`, { operation, ...context });

    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      this.info(`Completed ${operation}`, { 
        operation, 
        duration, 
        success: true,
        ...context 
      });
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.error(`Failed ${operation}`, { 
        operation, 
        duration, 
        success: false,
        error: error as Error,
        ...context 
      });
      throw error;
    }
  }
} 