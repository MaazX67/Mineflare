/**
 * Event Bus for inter-component communication
 */

import EventEmitter from 'eventemitter3';
import { Logger } from './Logger.js';

const logger = new Logger('EventBus');

/**
 * Central event bus for the entire bot system
 */
export class EventBus extends EventEmitter {
  constructor() {
    super();
    this.logger = logger.createChild('Bus');
    this._eventHistory = [];
    this._maxHistorySize = 100;
  }

  /**
   * Emit event with logging
   * @param {string} event
   * @param {...any} args
   */
  emit(event, ...args) {
    this.logger.debug(`Event: ${event}`, args[0]);
    this._recordEvent(event, args[0]);
    return super.emit(event, ...args);
  }

  /**
   * Record event in history
   * @private
   */
  _recordEvent(event, data) {
    this._eventHistory.push({
      event,
      data,
      timestamp: Date.now(),
    });
    
    if (this._eventHistory.length > this._maxHistorySize) {
      this._eventHistory.shift();
    }
  }

  /**
   * Get event history
   * @param {number} limit
   * @returns {Array}
   */
  getHistory(limit = 50) {
    return this._eventHistory.slice(-limit);
  }

  /**
   * Clear history
   */
  clearHistory() {
    this._eventHistory = [];
  }
}
