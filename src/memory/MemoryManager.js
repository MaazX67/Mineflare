/**
 * Memory manager for bot learning and storage
 */

import { Logger } from '../core/Logger.js';
import { KnowledgeBase } from './KnowledgeBase.js';

const logger = new Logger('MemoryManager');

/**
 * Manages bot memory and learning
 */
export class MemoryManager {
  /**
   * Create memory manager
   * @param {EventBus} eventBus
   * @param {Object} config
   */
  constructor(eventBus, config) {
    this.events = eventBus;
    this.config = config;
    this.logger = logger.createChild('Manager');
    
    this.knowledge = null;
    this.runtime = {}; // Temporary memory
  }

  /**
   * Initialize memory system
   */
  async initialize() {
    try {
      if (this.config.memory.persistence) {
        this.knowledge = new KnowledgeBase(this.config.memory.path);
        await this.knowledge.load();
        this.logger.info('Memory manager initialized with persistence');
      } else {
        this.knowledge = new KnowledgeBase(':memory:');
        this.logger.info('Memory manager initialized in-memory only');
      }
      
      this.events.emit('memory:initialized');
    } catch (error) {
      this.logger.error('Failed to initialize memory:', error);
      throw error;
    }
  }

  /**
   * Set value in persistent memory
   * @param {string} key
   * @param {any} value
   */
  set(key, value) {
    this.knowledge.set(key, value);
    this.events.emit('memory:set', { key, value });
  }

  /**
   * Get value from persistent memory
   * @param {string} key
   * @param {any} defaultValue
   * @returns {any}
   */
  get(key, defaultValue = null) {
    return this.knowledge.get(key, defaultValue);
  }

  /**
   * Set temporary runtime memory
   * @param {string} key
   * @param {any} value
   */
  setRuntime(key, value) {
    this.runtime[key] = value;
  }

  /**
   * Get temporary runtime memory
   * @param {string} key
   * @param {any} defaultValue
   * @returns {any}
   */
  getRuntime(key, defaultValue = null) {
    return this.runtime[key] ?? defaultValue;
  }

  /**
   * Save all memory to disk
   */
  async save() {
    if (this.knowledge) {
      await this.knowledge.save();
      this.logger.debug('Memory saved');
    }
  }

  /**
   * Get memory statistics
   * @returns {Object}
   */
  getStats() {
    const persistent = this.knowledge?.getAll() || {};
    return {
      persistentKeys: Object.keys(persistent).length,
      runtimeKeys: Object.keys(this.runtime).length,
      totalSize: JSON.stringify(persistent).length,
    };
  }
}
