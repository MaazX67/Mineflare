/**
 * Schematic parser and loader
 */

import { Logger } from '../core/Logger.js';

const logger = new Logger('Schematic');

/**
 * Handles schematic files
 */
export class Schematic {
  /**
   * Create schematic
   * @param {string} name
   * @param {Object} structure
   */
  constructor(name, structure) {
    this.name = name;
    this.structure = structure;
    this.logger = logger.createChild('Parser');
  }

  /**
   * Get schematic dimensions
   * @returns {Object}
   */
  getDimensions() {
    if (!this.structure.blocks || this.structure.blocks.length === 0) {
      return { width: 0, height: 0, depth: 0 };
    }

    let maxX = 0, maxY = 0, maxZ = 0;
    for (const block of this.structure.blocks) {
      maxX = Math.max(maxX, block.x);
      maxY = Math.max(maxY, block.y);
      maxZ = Math.max(maxZ, block.z);
    }

    return { width: maxX + 1, height: maxY + 1, depth: maxZ + 1 };
  }

  /**
   * Get block count
   * @returns {number}
   */
  getBlockCount() {
    return this.structure.blocks?.length || 0;
  }

  /**
   * Get blocks at layer
   * @param {number} y
   * @returns {Array}
   */
  getLayer(y) {
    return this.structure.blocks?.filter((b) => b.y === y) || [];
  }
}
