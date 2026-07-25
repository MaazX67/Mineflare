/**
 * Configuration loader with environment variable support
 */

import dotenv from 'dotenv';
import { Logger } from './Logger.js';

const logger = new Logger('ConfigLoader');

// Load environment variables
dotenv.config();

/**
 * Configuration loader with validation
 */
export class ConfigLoader {
  /**
   * Get configuration with defaults
   * @returns {Object}
   */
  static getConfig() {
    return {
      // Server
      server: {
        host: process.env.SERVER_HOST || 'localhost',
        port: parseInt(process.env.SERVER_PORT || '25565', 10),
        version: process.env.SERVER_VERSION || '1.20.1',
      },

      // Bot
      bot: {
        username: process.env.BOT_USERNAME || 'Mineflare',
        password: process.env.BOT_PASSWORD || '',
        onlineMode: process.env.BOT_ONLINE_MODE !== 'false',
      },

      // Authentication
      auth: {
        type: process.env.AUTH_TYPE || 'offline',
        microsoft: {
          email: process.env.MICROSOFT_EMAIL || '',
          password: process.env.MICROSOFT_PASSWORD || '',
        },
      },

      // Logging
      logging: {
        level: process.env.LOG_LEVEL || 'info',
        file: process.env.LOG_FILE || './data/logs/bot.log',
        pretty: process.env.LOG_PRETTY !== 'false',
      },

      // Dashboard
      dashboard: {
        enabled: process.env.DASHBOARD_ENABLED !== 'false',
        port: parseInt(process.env.DASHBOARD_PORT || '3000', 10),
        host: process.env.DASHBOARD_HOST || '0.0.0.0',
      },

      // API
      api: {
        enabled: process.env.API_ENABLED !== 'false',
        port: parseInt(process.env.API_PORT || '3001', 10),
        host: process.env.API_HOST || '0.0.0.0',
      },

      // Behavior
      behavior: {
        autoReconnect: process.env.AUTO_RECONNECT !== 'false',
        reconnectDelay: parseInt(process.env.RECONNECT_DELAY || '5000', 10),
        maxReconnectAttempts: parseInt(process.env.MAX_RECONNECT_ATTEMPTS || '10', 10),
        autoRespawn: process.env.AUTO_RESPAWN !== 'false',
        autoEat: process.env.AUTO_EAT !== 'false',
        autoSleep: process.env.AUTO_SLEEP !== 'false',
      },

      // Memory
      memory: {
        persistence: process.env.MEMORY_PERSISTENCE !== 'false',
        path: process.env.MEMORY_PATH || './data/memory',
      },

      // Plugins
      plugins: {
        path: process.env.PLUGIN_PATH || './data/plugins',
        autoLoad: process.env.PLUGIN_AUTO_LOAD !== 'false',
      },

      // Performance
      performance: {
        pathfindTimeout: parseInt(process.env.PATHFIND_TIMEOUT || '30000', 10),
        pathfindPartial: process.env.PATHFIND_PARTIAL !== 'false',
        maxTaskQueueSize: parseInt(process.env.MAX_TASK_QUEUE_SIZE || '100', 10),
      },
    };
  }

  /**
   * Get a specific config section
   * @param {string} section
   * @returns {Object}
   */
  static getSection(section) {
    const config = this.getConfig();
    return config[section] || {};
  }

  /**
   * Get a config value with fallback
   * @param {string} path - Dot notation path (e.g. 'server.host')
   * @param {any} defaultValue
   * @returns {any}
   */
  static get(path, defaultValue = undefined) {
    const config = this.getConfig();
    const keys = path.split('.');
    let value = config;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }

    return value;
  }

  /**
   * Validate configuration
   * @returns {Object} - { valid: boolean, errors: string[] }
   */
  static validate() {
    const errors = [];
    const config = this.getConfig();

    // Server validation
    if (!config.server.host) errors.push('SERVER_HOST is required');
    if (config.server.port < 1 || config.server.port > 65535) {
      errors.push('SERVER_PORT must be between 1 and 65535');
    }

    // Bot validation
    if (!config.bot.username) errors.push('BOT_USERNAME is required');

    // Dashboard port validation
    if (config.dashboard.port < 1 || config.dashboard.port > 65535) {
      errors.push('DASHBOARD_PORT must be between 1 and 65535');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
