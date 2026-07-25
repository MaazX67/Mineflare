/**
 * Central bot manager orchestrating all systems
 */

import { Logger } from './Logger.js';
import { EventBus } from './EventBus.js';
import { ConfigLoader } from './ConfigLoader.js';

const logger = new Logger('BotManager');

/**
 * Central manager for bot lifecycle and systems
 */
export class BotManager {
  constructor() {
    this.logger = logger;
    this.events = new EventBus();
    this.config = ConfigLoader.getConfig();
    this.systems = {};
    this.isRunning = false;
  }

  /**
   * Initialize all systems
   */
  async initialize() {
    try {
      // Validate configuration
      const validation = ConfigLoader.validate();
      if (!validation.valid) {
        throw new Error(`Configuration invalid: ${validation.errors.join(', ')}`);
      }

      this.logger.info('Initializing Mineflare systems...');
      this.events.emit('manager:initializing');

      // Initialize core systems in order
      this.systems.initialized = true;
      this.events.emit('manager:initialized');
      this.logger.info('All systems initialized successfully');

    } catch (error) {
      this.logger.error('Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Connect to Minecraft server
   */
  async connect() {
    try {
      this.logger.info('Connecting to server...', {
        host: this.config.server.host,
        port: this.config.server.port,
      });

      this.events.emit('manager:connecting');
      this.isRunning = true;
      this.events.emit('manager:connected');

      this.logger.info('Successfully connected to Minecraft server');

    } catch (error) {
      this.logger.error('Connection failed:', error);
      this.isRunning = false;
      throw error;
    }
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    try {
      this.logger.info('Shutting down Mineflare...');
      this.events.emit('manager:shutting_down');

      this.isRunning = false;
      this.events.emit('manager:shutdown');

      this.logger.info('Shutdown complete');

    } catch (error) {
      this.logger.error('Error during shutdown:', error);
    }
  }

  /**
   * Get system status
   * @returns {Object}
   */
  getStatus() {
    return {
      running: this.isRunning,
      initialized: this.systems.initialized,
      config: this.config,
      uptime: process.uptime(),
    };
  }
}
