/**
 * Inventory management system
 */

import { Logger } from '../core/Logger.js';

const logger = new Logger('InventoryManager');

/**
 * Manages bot inventory operations
 */
export class InventoryManager {
  /**
   * Create inventory manager
   * @param {EventBus} eventBus
   */
  constructor(eventBus) {
    this.events = eventBus;
    this.logger = logger.createChild('Manager');
    this.items = new Map();
  }

  /**
   * Update inventory from bot
   * @param {BotInstance} bot
   */
  updateFromBot(bot) {
    if (!bot.getRaw()?.inventory) return;
    
    this.items.clear();
    for (const item of bot.getRaw().inventory.items()) {
      const key = `${item.type}:${item.metadata}`;
      if (this.items.has(key)) {
        const existing = this.items.get(key);
        existing.count += item.count;
      } else {
        this.items.set(key, { ...item });
      }
    }
    
    this.logger.debug('Inventory updated');
    this.events.emit('inventory:updated', this.getInfo());
  }

  /**
   * Get item count
   * @param {string|number} itemId
   * @returns {number}
   */
  getItemCount(itemId) {
    for (const [, item] of this.items) {
      if (item.type === itemId || item.name === itemId) {
        return item.count || 0;
      }
    }
    return 0;
  }

  /**
   * Find item by name
   * @param {string} name
   * @returns {Object|null}
   */
  findItem(name) {
    for (const [, item] of this.items) {
      if (item.name === name) {
        return item;
      }
    }
    return null;
  }

  /**
   * Find items by category
   * @param {string} category
   * @returns {Array}
   */
  findItemsByCategory(category) {
    const items = [];
    for (const [, item] of this.items) {
      if (item.name?.includes(category)) {
        items.push(item);
      }
    }
    return items;
  }

  /**
   * Drop item
   * @param {Object} item
   * @param {number} count
   */
  async dropItem(item, count = 1) {
    if (!item) return;
    this.logger.info(`Dropping ${count}x ${item.name}`);
    this.events.emit('inventory:dropped', { item: item.name, count });
  }

  /**
   * Get inventory info
   * @returns {Object}
   */
  getInfo() {
    const items = Array.from(this.items.values()).map((item) => ({
      name: item.name,
      count: item.count,
      type: item.type,
    }));
    
    return {
      items,
      totalSlots: items.length,
      totalItems: items.reduce((sum, item) => sum + item.count, 0),
    };
  }
}
