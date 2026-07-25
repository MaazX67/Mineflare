/**
 * Base Task class
 */

import { Logger } from '../core/Logger.js';

/**
 * Base class for all tasks
 */
export class Task {
  /**
   * Create task
   * @param {string} name - Task name
   * @param {number} priority - Task priority (0-100, higher = more important)
   */
  constructor(name, priority = 50) {
    this.id = this._generateId();
    this.name = name;
    this.priority = Math.max(0, Math.min(100, priority));
    this.status = 'pending'; // pending, running, completed, cancelled, failed
    this.startTime = null;
    this.endTime = null;
    this.error = null;
    this.logger = new Logger(`Task:${name}`);
  }

  /**
   * Generate unique task ID
   * @private
   * @returns {string}
   */
  _generateId() {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Execute task - override in subclass
   * @param {BotInstance} bot
   */
  async execute(bot) {
    throw new Error('execute() must be implemented in subclass');
  }

  /**
   * Start task execution
   * @param {BotInstance} bot
   */
  async start(bot) {
    try {
      this.status = 'running';
      this.startTime = Date.now();
      this.logger.info(`Started task: ${this.name}`);
      
      await this.execute(bot);
      
      this.status = 'completed';
      this.endTime = Date.now();
      this.logger.info(`Completed task: ${this.name} (${this.getDuration()}ms)`);
    } catch (error) {
      this.status = 'failed';
      this.error = error;
      this.endTime = Date.now();
      this.logger.error(`Task failed: ${this.name}`, error);
      throw error;
    }
  }

  /**
   * Cancel task
   */
  cancel() {
    this.status = 'cancelled';
    this.endTime = Date.now();
    this.logger.info(`Cancelled task: ${this.name}`);
  }

  /**
   * Get task duration
   * @returns {number}
   */
  getDuration() {
    const end = this.endTime || Date.now();
    return end - (this.startTime || Date.now());
  }

  /**
   * Get task info
   * @returns {Object}
   */
  getInfo() {
    return {
      id: this.id,
      name: this.name,
      priority: this.priority,
      status: this.status,
      startTime: this.startTime,
      endTime: this.endTime,
      duration: this.getDuration(),
      error: this.error?.message,
    };
  }
}
