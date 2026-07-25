/**
 * Base Behavior class
 */

import { Logger } from '../core/Logger.js';

/**
 * Base class for all bot behaviors
 */
export class Behavior {
  /**
   * Create behavior
   * @param {string} name - Behavior name
   * @param {number} priority - Behavior priority (0-100)
   */
  constructor(name, priority = 50) {
    this.name = name;
    this.priority = Math.max(0, Math.min(100, priority));
    this.active = false;
    this.lastThink = null;
    this.state = {};
    this.logger = new Logger(`Behavior:${name}`);
  }

  /**
   * Think method - decision making logic
   * @param {BotInstance} bot
   */
  async think(bot) {
    throw new Error('think() must be implemented in subclass');
  }

  /**
   * Initialize behavior
   * @param {BotInstance} bot
   */
  async initialize(bot) {
    this.logger.info(`Initialized behavior: ${this.name}`);
  }

  /**
   * Cleanup behavior
   * @param {BotInstance} bot
   */
  async cleanup(bot) {
    this.logger.info(`Cleaned up behavior: ${this.name}`);
  }

  /**
   * Activate behavior
   */
  activate() {
    this.active = true;
    this.logger.debug(`Activated: ${this.name}`);
  }

  /**
   * Deactivate behavior
   */
  deactivate() {
    this.active = false;
    this.logger.debug(`Deactivated: ${this.name}`);
  }

  /**
   * Update behavior state
   * @param {string} key
   * @param {any} value
   */
  setState(key, value) {
    this.state[key] = value;
  }

  /**
   * Get behavior state
   * @param {string} key
   */
  getState(key) {
    return this.state[key];
  }

  /**
   * Get behavior info
   * @returns {Object}
   */
  getInfo() {
    return {
      name: this.name,
      priority: this.priority,
      active: this.active,
      state: this.state,
    };
  }
}
