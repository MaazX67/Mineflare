/**
 * Structured logging system using Pino
 */

import pino from 'pino';
import pretty from 'pino-pretty';

/**
 * Main logger instance (singleton)
 */
let mainLogger = null;

/**
 * Get or create main logger
 * @private
 */
function getMainLogger() {
  if (!mainLogger) {
    const transport = pretty({
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      singleLine: false,
    });
    
    mainLogger = pino({ level: process.env.LOG_LEVEL || 'info' }, transport);
  }
  return mainLogger;
}

/**
 * Structured logger using Pino
 */
export class Logger {
  /**
   * Create logger
   * @param {string} name - Logger name
   */
  constructor(name) {
    this.name = name;
    this._logger = getMainLogger().child({ component: name });
  }

  /**
   * Create child logger
   * @param {string} name
   * @returns {Logger}
   */
  createChild(name) {
    const child = new Logger(`${this.name}:${name}`);
    return child;
  }

  /**
   * Log info level
   * @param {string} message
   * @param {any} data
   */
  info(message, data = {}) {
    this._logger.info(data, message);
  }

  /**
   * Log debug level
   * @param {string} message
   * @param {any} data
   */
  debug(message, data = {}) {
    this._logger.debug(data, message);
  }

  /**
   * Log warn level
   * @param {string} message
   * @param {any} data
   */
  warn(message, data = {}) {
    this._logger.warn(data, message);
  }

  /**
   * Log error level
   * @param {string} message
   * @param {Error|any} error
   */
  error(message, error = {}) {
    this._logger.error(error, message);
  }
}
