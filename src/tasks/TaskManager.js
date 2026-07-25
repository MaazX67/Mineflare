/**
 * Task execution manager
 */

import { Logger } from '../core/Logger.js';
import { TaskQueue } from './TaskQueue.js';

const logger = new Logger('TaskManager');

/**
 * Manages task execution and scheduling
 */
export class TaskManager {
  /**
   * Create task manager
   * @param {EventBus} eventBus
   * @param {Object} config
   */
  constructor(eventBus, config) {
    this.events = eventBus;
    this.config = config;
    this.logger = logger.createChild('Manager');
    
    this.queue = new TaskQueue(config.performance.maxTaskQueueSize);
    this.currentTask = null;
    this.isRunning = false;
    this.taskHistory = [];
    this.maxHistorySize = 100;
  }

  /**
   * Start task manager
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.logger.info('Task manager started');
    this._processQueue();
  }

  /**
   * Stop task manager
   */
  stop() {
    this.isRunning = false;
    if (this.currentTask) {
      this.currentTask.cancel();
    }
    this.logger.info('Task manager stopped');
  }

  /**
   * Queue a task
   * @param {Task} task
   */
  queue(task) {
    this.queue.enqueue(task);
    this.logger.debug(`Task queued: ${task.name}`);
    this.events.emit('task:queued', task.getInfo());
  }

  /**
   * Cancel task by ID
   * @param {string} taskId
   */
  cancel(taskId) {
    // If it's the current task
    if (this.currentTask?.id === taskId) {
      this.currentTask.cancel();
      this.currentTask = null;
      this.logger.info(`Cancelled current task: ${taskId}`);
      return true;
    }

    // If it's in the queue
    const task = this.queue.remove(taskId);
    if (task) {
      task.cancel();
      this.logger.info(`Cancelled queued task: ${taskId}`);
      return true;
    }

    return false;
  }

  /**
   * Get queue status
   * @returns {Object}
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      currentTask: this.currentTask?.getInfo() || null,
      queueSize: this.queue.size(),
      queuedTasks: this.queue.getAll().map((t) => t.getInfo()),
    };
  }

  /**
   * Process queue continuously
   * @private
   */
  async _processQueue() {
    while (this.isRunning) {
      try {
        const task = this.queue.dequeue();
        
        if (!task) {
          await this._sleep(100);
          continue;
        }

        this.currentTask = task;
        this.events.emit('task:started', task.getInfo());
        
        // Execute task (bot will be injected by BotManager)
        await task.start(this.bot);
        
        this._recordTask(task);
        this.events.emit('task:completed', task.getInfo());

      } catch (error) {
        if (this.currentTask) {
          this._recordTask(this.currentTask);
          this.events.emit('task:failed', {
            ...this.currentTask.getInfo(),
            error: error.message,
          });
        }
        this.logger.error('Task execution error:', error);
      } finally {
        this.currentTask = null;
      }
    }
  }

  /**
   * Record completed task in history
   * @private
   */
  _recordTask(task) {
    this.taskHistory.push(task.getInfo());
    if (this.taskHistory.length > this.maxHistorySize) {
      this.taskHistory.shift();
    }
  }

  /**
   * Get task history
   * @param {number} limit
   * @returns {Array}
   */
  getHistory(limit = 50) {
    return this.taskHistory.slice(-limit);
  }

  /**
   * Sleep utility
   * @private
   */
  _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
