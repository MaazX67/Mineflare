/**
 * Bot recovery and reconnection management
 */

import { Logger } from '../core/Logger.js';

const logger = new Logger('RecoveryManager');

/**
 * Handles bot recovery and reconnection logic
 */
export class RecoveryManager {
  /**
   * Create recovery manager
   * @param {BotInstance} botInstance
   * @param {Object} config
   * @param {EventBus} eventBus
   */
  constructor(botInstance, config, eventBus) {
    this.bot = botInstance;
    this.config = config;
    this.events = eventBus;
    this.logger = logger.createChild('Recovery');
    
    this.reconnectTimer = null;
    this.reconnectAttempt = 0;
  }

  /**
   * Schedule reconnection
   */
  scheduleReconnect() {
    const maxAttempts = this.config.behavior.maxReconnectAttempts;
    
    if (this.reconnectAttempt >= maxAttempts) {
      this.logger.error(`Max reconnection attempts (${maxAttempts}) reached`);
      this.events.emit('recovery:maxAttemptsReached');
      return;
    }

    const delay = this.config.behavior.reconnectDelay;
    this.reconnectAttempt++;
    
    this.logger.info(
      `Scheduling reconnection attempt ${this.reconnectAttempt}/${maxAttempts} in ${delay}ms`
    );
    
    this.events.emit('recovery:reconnecting', {
      attempt: this.reconnectAttempt,
      maxAttempts,
      delay,
    });

    this.reconnectTimer = setTimeout(() => {
      this._attemptReconnect();
    }, delay);
  }

  /**
   * Attempt to reconnect
   * @private
   */
  async _attemptReconnect() {
    try {
      this.logger.info('Attempting to reconnect...');
      await this.bot.connect();
      this.reconnectAttempt = 0;
      this.logger.info('Reconnected successfully');
      this.events.emit('recovery:reconnected');
    } catch (error) {
      this.logger.error('Reconnection failed:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Cancel reconnection
   */
  cancelReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
      this.logger.info('Reconnection cancelled');
    }
  }

  /**
   * Get recovery status
   * @returns {Object}
   */
  getStatus() {
    return {
      isScheduled: !!this.reconnectTimer,
      attempt: this.reconnectAttempt,
      maxAttempts: this.config.behavior.maxReconnectAttempts,
    };
  }
}
