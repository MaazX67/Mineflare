/**
 * Configuration validation schemas
 */

/**
 * Validate configuration schema
 * @param {Object} config
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
export function validateConfig(config) {
  const errors = [];

  // Server validation
  if (typeof config.server?.host !== 'string') {
    errors.push('server.host must be a string');
  }
  if (!Number.isInteger(config.server?.port) || config.server.port < 1 || config.server.port > 65535) {
    errors.push('server.port must be between 1 and 65535');
  }

  // Bot validation
  if (typeof config.bot?.username !== 'string') {
    errors.push('bot.username must be a string');
  }

  // Performance validation
  if (!Number.isInteger(config.performance?.maxTaskQueueSize) || config.performance.maxTaskQueueSize < 1) {
    errors.push('performance.maxTaskQueueSize must be a positive integer');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
