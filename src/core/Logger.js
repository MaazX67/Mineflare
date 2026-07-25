/**
 * Structured logging system using Pino
 */

import pino from 'pino';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdir } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..');
const logsDir = join(projectRoot, 'data', 'logs');

/**
 * Logger class providing structured logging with Pino
 */
export class Logger {
  /**
   * Create a new logger instance
   * @param {string} name - Logger context name
   */
  constructor(name) {
    this.name = name;
    this.logger = this._createLogger();
  }

  /**
   * Create the Pino logger instance
   * @private
   * @returns {pino.Logger}
   */
  _createLogger() {
    const isDev = process.env.NODE_ENV !== 'production';
    const logLevel = process.env.LOG_LEVEL || 'info';

    const options = {
      level: logLevel,
      base: { name: this.name },
    };

    // Development: pretty print to console
    if (isDev && process.env.LOG_PRETTY !== 'false') {
      return pino(
        {
          ...options,
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          },
        },
      );
    }

    // Production: structured JSON logging
    return pino(options);
  }

  /**
   * Log at debug level
   * @param {string} message
   * @param {any} data
   */
  debug(message, data) {
    this.logger.debug(data || {}, message);
  }

  /**
   * Log at info level
   * @param {string} message
   * @param {any} data
   */
  info(message, data) {
    this.logger.info(data || {}, message);
  }

  /**
   * Log at warn level
   * @param {string} message
   * @param {any} data
   */
  warn(message, data) {
    this.logger.warn(data || {}, message);
  }

  /**
   * Log at error level
   * @param {string} message
   * @param {Error|any} error
   */
  error(message, error) {
    if (error instanceof Error) {
      this.logger.error({
        stack: error.stack,
        name: error.name,
        message: error.message,
      }, message);
    } else {
      this.logger.error(error || {}, message);
    }
  }

  /**
   * Create a child logger
   * @param {string} childName
   * @returns {Logger}
   */
  createChild(childName) {
    const child = new Logger(`${this.name}:${childName}`);
    return child;
  }
}
