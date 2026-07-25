/**
 * PvE combat controller
 */

import { Logger } from '../core/Logger.js';

const logger = new Logger('PvEController');

/**
 * Handles PvE combat (vs mobs)
 */
export class PvEController {
  constructor() {
    this.logger = logger.createChild('Controller');
    this.targetEntity = null;
    this.isEngaged = false;
  }

  /**
   * Engage entity
   * @param {Object} entity
   */
  engage(entity) {
    this.targetEntity = entity;
    this.isEngaged = true;
    this.logger.info(`Engaged: ${entity.type}`);
  }

  /**
   * Attack target
   * @param {BotInstance} bot
   */
  async attack(bot) {
    if (!this.targetEntity) return;
    this.logger.debug('Attacking target');
  }

  /**
   * Disengage combat
   */
  disengage() {
    this.isEngaged = false;
    this.targetEntity = null;
    this.logger.info('Disengaged');
  }

  /**
   * Calculate damage
   * @param {number} level
   * @returns {number}
   */
  calculateDamage(level) {
    return 1 + (level * 0.5);
  }
}
