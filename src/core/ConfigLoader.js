/**
 * Configuration loader
 */

import { config } from 'dotenv';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { Logger } from './Logger.js';

const logger = new Logger('ConfigLoader');

/**
 * Load and merge configuration
 */
export async function loadConfig() {
  try {
    // Load environment variables
    config();

    // Load default config
    const defaultConfigPath = join(process.cwd(), 'src/config/default.js');
    const { default: defaultConfig } = await import(`file://${defaultConfigPath}`);

    // Merge with environment variables
    const envConfig = {
      server: {
        host: process.env.SERVER_HOST || defaultConfig.server.host,
        port: parseInt(process.env.SERVER_PORT) || defaultConfig.server.port,
        version: process.env.SERVER_VERSION || defaultConfig.server.version,
      },
      bot: {
        username: process.env.BOT_USERNAME || defaultConfig.bot.username,
        password: process.env.BOT_PASSWORD || defaultConfig.bot.password,
        onlineMode: process.env.BOT_ONLINE_MODE === 'true' || defaultConfig.bot.onlineMode,
      },
      behavior: defaultConfig.behavior,
      performance: defaultConfig.performance,
      logging: {
        level: process.env.LOG_LEVEL || 'info',
        pretty: process.env.LOG_PRETTY !== 'false',
      },
      dashboard: {
        enabled: process.env.DASHBOARD_ENABLED !== 'false',
        port: parseInt(process.env.DASHBOARD_PORT) || 3000,
        host: process.env.DASHBOARD_HOST || 'localhost',
      },
      api: {
        enabled: process.env.API_ENABLED !== 'false',
        port: parseInt(process.env.API_PORT) || 3001,
        host: process.env.API_HOST || 'localhost',
      },
      memory: {
        persistence: process.env.MEMORY_PERSISTENCE !== 'false',
        path: process.env.MEMORY_PATH || './data/memory',
      },
      plugins: {
        path: process.env.PLUGIN_PATH || './data/plugins',
        autoLoad: process.env.PLUGIN_AUTO_LOAD !== 'false',
      },
      commandPrefix: process.env.COMMAND_PREFIX || '!',
    };

    logger.info('Configuration loaded successfully');
    return envConfig;
  } catch (error) {
    logger.error('Failed to load configuration:', error);
    throw error;
  }
}
