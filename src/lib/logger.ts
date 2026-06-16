import winston from 'winston';

const { combine, timestamp, printf, colorize, json } = winston.format;

// Custom format for clean terminal reading during development
const consoleLogFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }), // Automatically capture stack traces
    json(),
  ),
  transports: [
    // 1. Write all logs with level 'error' and important exceptions to error.log
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB limit per file
      maxFiles: 5,
    }),
    // 2. Write all logs with level 'info' and below to combined.log
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

// If we're not in production, log to the console with beautiful colorized formatting
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), consoleLogFormat),
    }),
  );
}

export default logger;
