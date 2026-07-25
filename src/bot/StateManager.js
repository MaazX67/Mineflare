/**
 * Bot Recovery Manager
 */

import { Logger } from '../core/Logger.js';

const logger = new Logger('RecoveryManager');

/**
 * Handles bot reconnection and error recovery
 */
export class RecoveryManager {
  /**
   * Create recovery manager
   * @param {Object} config
   * @param {EventBus} eventBus
   */
  constructor(config, eventBus) {
    this.config = config;
    this.events = eventBus;
    this.logger = logger.createChild('Manager');
    this.reconnectAttempts = 0;
    this.isRecovering = false;
  }

  /**
   * Handle connection error
   * @param {Error} error
   * @param {BotInstance} bot
   */
  async handleError(error, bot) {
    this.logger.error('Connection error:', error);
    
    if (!this.config.behavior.autoReconnect) {
      return;
    }
    
    if (this.reconnectAttempts >= this.config.behavior.maxReconnectAttempts) {
      this.logger.error('Max reconnect attempts reached');
      this.events.emit('bot:error', { error: error.message });
      return;
    }
    
    this.isRecovering = true;
    this.reconnectAttempts++;
    
    const delay = this.config.behavior.reconnectDelay * this.reconnectAttempts;
    this.logger.info(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})...`);
    
    await new Promise((resolve) => setTimeout(resolve, delay));
    
    this.isRecovering = false;
    this.events.emit('recovery:reconnect');
  }

  /**
   * Reset recovery state
   */
  reset() {
    this.reconnectAttempts = 0;
    this.isRecovering = false;
  }
}
