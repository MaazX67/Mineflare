/**
 * Movement controller
 */

import { Logger } from '../core/Logger.js';

const logger = new Logger('Movement');

/**
 * Handles bot movement and animation
 */
export class Movement {
  constructor() {
    this.logger = logger.createChild('Controller');
    this.isMoving = false;
    this.currentTarget = null;
  }

  /**
   * Move to position
   * @param {BotInstance} bot
   * @param {Object} target
   * @param {number} timeout
   */
  async moveTowards(bot, target, timeout = 30000) {
    this.isMoving = true;
    this.currentTarget = target;
    
    this.logger.info(`Moving towards ${target.x.toFixed(1)}, ${target.y.toFixed(1)}, ${target.z.toFixed(1)}`);
    
    try {
      // Simulated movement - would use mineflayer pathfinder in production
      await new Promise((resolve) => {
        setTimeout(() => {
          this.isMoving = false;
          this.logger.debug('Reached target');
          resolve();
        }, 1000);
      });
    } catch (error) {
      this.logger.error('Movement error:', error);
      throw error;
    } finally {
      this.isMoving = false;
      this.currentTarget = null;
    }
  }

  /**
   * Stop movement
   */
  stop() {
    this.isMoving = false;
    this.currentTarget = null;
    this.logger.debug('Movement stopped');
  }

  /**
   * Calculate distance
   * @param {Object} from
   * @param {Object} to
   * @returns {number}
   */
  calculateDistance(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dz = to.z - from.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}
