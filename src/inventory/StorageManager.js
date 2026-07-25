/**
 * Storage and chest management
 */

import { Logger } from '../core/Logger.js';

const logger = new Logger('StorageManager');

/**
 * Manages chest and storage interactions
 */
export class StorageManager {
  constructor() {
    this.logger = logger.createChild('Manager');
    this.storageLocations = new Map();
  }

  /**
   * Register storage location
   * @param {string} name
   * @param {Object} position
   */
  registerStorage(name, position) {
    this.storageLocations.set(name, {
      name,
      position,
      items: [],
      lastAccess: null,
    });
    this.logger.info(`Registered storage: ${name}`);
  }

  /**
   * Get storage by name
   * @param {string} name
   * @returns {Object|null}
   */
  getStorage(name) {
    return this.storageLocations.get(name) || null;
  }

  /**
   * Get nearest storage
   * @param {Object} position
   * @returns {Object|null}
   */
  getNearestStorage(position) {
    let nearest = null;
    let minDistance = Infinity;

    for (const [, storage] of this.storageLocations) {
      const dx = storage.position.x - position.x;
      const dy = storage.position.y - position.y;
      const dz = storage.position.z - position.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (distance < minDistance) {
        minDistance = distance;
        nearest = storage;
      }
    }

    return nearest;
  }

  /**
   * Find item in storage
   * @param {string} itemName
   * @returns {Object|null}
   */
  findItemInStorage(itemName) {
    for (const [, storage] of this.storageLocations) {
      for (const item of storage.items) {
        if (item.name === itemName) {
          return { storage: storage.name, item };
        }
      }
    }
    return null;
  }

  /**
   * Store item
   * @param {string} storageName
   * @param {Object} item
   */
  storeItem(storageName, item) {
    const storage = this.getStorage(storageName);
    if (storage) {
      storage.items.push(item);
      storage.lastAccess = Date.now();
      this.logger.debug(`Stored item in ${storageName}: ${item.name}`);
    }
  }
}
