/**
 * Event bus for inter-component communication
 */

import EventEmitter from 'eventemitter3';
import { Logger } from './Logger.js';

const logger = new Logger('EventBus');

/**
 * Central event bus using EventEmitter3
 */
export class EventBus {
  constructor() {
    this.emitter = new EventEmitter();
    this.eventHistory = [];
    this.maxHistorySize = 1000;
  }

  /**
   * Register event listener
   * @param {string} event - Event name
   * @param {Function} listener - Event handler
   * @returns {Function} - Unsubscribe function
   */
  on(event, listener) {
    this.emitter.on(event, listener);
    
    // Return unsubscribe function
    return () => this.off(event, listener);
  }

  /**
   * Register one-time event listener
   * @param {string} event - Event name
   * @param {Function} listener - Event handler
   * @returns {Function} - Unsubscribe function
   */
  once(event, listener) {
    this.emitter.once(event, listener);
    
    return () => this.off(event, listener);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} listener - Event handler
   */
  off(event, listener) {
    this.emitter.off(event, listener);
  }

  /**
   * Emit event
   * @param {string} event - Event name
   * @param {...any} args - Event arguments
   */
  emit(event, ...args) {
    try {
      this.emitter.emit(event, ...args);
      this._recordEvent(event, args);
    } catch (error) {
      logger.error(`Error emitting event ${event}:`, error);
    }
  }

  /**
   * Wait for event to be emitted
   * @param {string} event - Event name
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise}
   */
  async wait(event, timeout = 30000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.off(event, handler);
        reject(new Error(`Event "${event}" timeout after ${timeout}ms`));
      }, timeout);

      const handler = (...args) => {
        clearTimeout(timer);
        resolve(args.length === 1 ? args[0] : args);
      };

      this.once(event, handler);
    });
  }

  /**
   * Get listener count for event
   * @param {string} event - Event name
   * @returns {number}
   */
  listenerCount(event) {
    return this.emitter.listenerCount(event);
  }

  /**
   * Remove all listeners for an event
   * @param {string} event - Event name
   */
  removeAllListeners(event) {
    this.emitter.removeAllListeners(event);
  }

  /**
   * Record event in history
   * @private
   * @param {string} event
   * @param {any} data
   */
  _recordEvent(event, data) {
    this.eventHistory.push({
      event,
      data,
      timestamp: Date.now(),
    });

    // Keep history size manageable
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
  }

  /**
   * Get event history
   * @param {number} limit
   * @returns {Array}
   */
  getHistory(limit = 100) {
    return this.eventHistory.slice(-limit);
  }

  /**
   * Clear event history
   */
  clearHistory() {
    this.eventHistory = [];
  }
}
