/**
 * Combat manager orchestrating combat systems
 */

import { Logger } from '../core/Logger.js';
import { PvEController } from './PvEController.js';
import { PvPController } from './PvPController.js';

const logger = new Logger('CombatManager');

/**
 * Central combat manager
 */
export class CombatManager {
  /**
   * Create combat manager
   * @param {EventBus} eventBus
   */
  constructor(eventBus) {
    this.events = eventBus;
    this.logger = logger.createChild('Manager');
    this.pve = new PvEController();
    this.pvp = new PvPController();
    this.isEnabled = false;
  }

  /**
   * Enable combat
   */
  enable() {
    this.isEnabled = true;
    this.logger.info('Combat enabled');
    this.events.emit('combat:enabled');
  }

  /**
   * Disable combat
   */
  disable() {
    this.isEnabled = false;
    this.pve.disengage();
    this.pvp.disengage();
    this.logger.info('Combat disabled');
    this.events.emit('combat:disabled');
  }

  /**
   * Engage entity/player
   * @param {Object} target - Entity or player object
   */
  engage(target) {
    if (!this.isEnabled) return;

    if (target.username) {
      // It's a player
      this.pvp.engage(target);
      this.logger.info(`Engaging player: ${target.username}`);
    } else {
      // It's an entity
      this.pve.engage(target);
      this.logger.info(`Engaging entity: ${target.type}`);
    }
  }

  /**
   * Execute combat tick
   * @param {BotInstance} bot
   */
  async tick(bot) {
    if (!this.isEnabled) return;

    if (this.pvp.isEngaged) {
      await this.pvp.executeStrategy(bot);
    } else if (this.pve.isEngaged) {
      await this.pve.attack(bot);
    }
  }

  /**
   * Get combat status
   * @returns {Object}
   */
  getStatus() {
    return {
      enabled: this.isEnabled,
      pvpEngaged: this.pvp.isEngaged,
      pveEngaged: this.pve.isEngaged,
      pvpStrategy: this.pvp.strategy,
    };
  }
}
