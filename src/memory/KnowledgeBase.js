/**
 * Knowledge base for persistent memory storage
 */

import { Logger } from '../core/Logger.js';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const logger = new Logger('KnowledgeBase');

/**
 * Persistent knowledge base for bot learning
 */
export class KnowledgeBase {
  /**
   * Create knowledge base
   * @param {string} path - Storage path
   */
  constructor(path) {
    this.path = path;
    this.data = {};
    this.isDirty = false;
    this.logger = logger.createChild('Base');
  }

  /**
   * Load knowledge base from disk
   */
  async load() {
    try {
      await mkdir(this.path, { recursive: true });
      const filePath = join(this.path, 'knowledge.json');
      
      try {
        const content = await readFile(filePath, 'utf-8');
        this.data = JSON.parse(content);
        this.logger.info('Knowledge base loaded');
      } catch (error) {
        if (error.code === 'ENOENT') {
          this.logger.info('Creating new knowledge base');
          this.data = {};
        } else {
          throw error;
        }
      }
    } catch (error) {
      this.logger.error('Failed to load knowledge base:', error);
      throw error;
    }
  }

  /**
   * Save knowledge base to disk
   */
  async save() {
    if (!this.isDirty) return;
    
    try {
      const filePath = join(this.path, 'knowledge.json');
      await writeFile(filePath, JSON.stringify(this.data, null, 2));
      this.isDirty = false;
      this.logger.debug('Knowledge base saved');
    } catch (error) {
      this.logger.error('Failed to save knowledge base:', error);
    }
  }

  /**
   * Set knowledge
   * @param {string} key
   * @param {any} value
   */
  set(key, value) {
    this.data[key] = value;
    this.isDirty = true;
  }

  /**
   * Get knowledge
   * @param {string} key
   * @param {any} defaultValue
   * @returns {any}
   */
  get(key, defaultValue = null) {
    return this.data[key] ?? defaultValue;
  }

  /**
   * Delete knowledge
   * @param {string} key
   */
  delete(key) {
    delete this.data[key];
    this.isDirty = true;
  }

  /**
   * Check if knowledge exists
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return key in this.data;
  }

  /**
   * Get all knowledge
   * @returns {Object}
   */
  getAll() {
    return JSON.parse(JSON.stringify(this.data));
  }

  /**
   * Clear all knowledge
   */
  clear() {
    this.data = {};
    this.isDirty = true;
  }
}
