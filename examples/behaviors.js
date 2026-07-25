/**
 * Example bot behavior - idle behavior
 */

import { Behavior } from '../behaviors/Behavior.js';

/**
 * Simple idle behavior
 */
export class IdleBehavior extends Behavior {
  constructor() {
    super('IdleBehavior', 10);
  }

  async initialize(bot) {
    this.logger.info('Idle behavior initialized');
  }

  async think(bot) {
    // Simple idle logic - just look around occasionally
    if (Math.random() < 0.05) {
      const yaw = Math.random() * Math.PI * 2;
      const pitch = (Math.random() - 0.5) * Math.PI;
      // Would set look direction in production
    }
  }
}

/**
 * Self-preservation behavior
 */
export class SelfPreservationBehavior extends Behavior {
  constructor() {
    super('SelfPreservationBehavior', 95);
  }

  async think(bot) {
    const health = bot.getHealth();
    const hunger = bot.getHunger();

    // Run away if health is low
    if (health < 5) {
      this.logger.warn('Health critical! Running away!');
      // Would implement running logic in production
    }

    // Eat if hungry
    if (hunger < 5) {
      this.logger.info('Eating food...');
      // Would implement eating logic in production
    }
  }
}
