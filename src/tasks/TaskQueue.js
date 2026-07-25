/**
 * Priority task queue
 */

import { Logger } from '../core/Logger.js';

const logger = new Logger('TaskQueue');

/**
 * Priority-based task queue
 */
export class TaskQueue {
  constructor(maxSize = 100) {
    this.queue = [];
    this.maxSize = maxSize;
  }

  /**
   * Add task to queue
   * @param {Task} task
   */
  enqueue(task) {
    if (this.queue.length >= this.maxSize) {
      throw new Error(`Task queue is full (max: ${this.maxSize})`);
    }

    this.queue.push(task);
    this._sort();
    logger.debug(`Task queued: ${task.name} (priority: ${task.priority})`);
  }

  /**
   * Remove and return next task
   * @returns {Task|null}
   */
  dequeue() {
    return this.queue.shift() || null;
  }

  /**
   * Peek at next task without removing
   * @returns {Task|null}
   */
  peek() {
    return this.queue[0] || null;
  }

  /**
   * Get queue size
   * @returns {number}
   */
  size() {
    return this.queue.length;
  }

  /**
   * Check if queue is empty
   * @returns {boolean}
   */
  isEmpty() {
    return this.queue.length === 0;
  }

  /**
   * Remove task by ID
   * @param {string} taskId
   * @returns {Task|null}
   */
  remove(taskId) {
    const index = this.queue.findIndex((t) => t.id === taskId);
    if (index !== -1) {
      const [task] = this.queue.splice(index, 1);
      return task;
    }
    return null;
  }

  /**
   * Get task by ID
   * @param {string} taskId
   * @returns {Task|null}
   */
  getTask(taskId) {
    return this.queue.find((t) => t.id === taskId) || null;
  }

  /**
   * Get all tasks
   * @returns {Array}
   */
  getAll() {
    return [...this.queue];
  }

  /**
   * Clear queue
   */
  clear() {
    this.queue = [];
  }

  /**
   * Sort queue by priority (descending)
   * @private
   */
  _sort() {
    this.queue.sort((a, b) => b.priority - a.priority);
  }
}
