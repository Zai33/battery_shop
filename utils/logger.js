import winston from "winston";

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Human-friendly logs for console, JSON logs for files.
const consoleFormat = combine(
  colorize(),
  timestamp(),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) => {
    return stack ? `${timestamp} [${level}]: ${stack}` : `${timestamp} [${level}]: ${message}`;
  })
);

const fileFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: fileFormat,
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      format: fileFormat,
    }),
  ],
});

export default logger;
