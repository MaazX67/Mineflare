/**
 * Example tasks for Mineflare
 */

import { Task } from '../tasks/Task.js';

/**
 * Example wood gathering task
 */
export class GatherWoodTask extends Task {
  constructor(count = 64) {
    super('gather_wood', 70);
    this.targetCount = count;
  }

  async execute(bot) {
    this.logger.info(`Gathering ${this.targetCount} wood...`);
    // Task execution logic here
    this.logger.info('Wood gathering completed!');
  }
}

/**
 * Example stone mining task
 */
export class MineStoneTask extends Task {
  constructor(count = 32) {
    super('mine_stone', 75);
    this.targetCount = count;
  }

  async execute(bot) {
    this.logger.info(`Mining ${this.targetCount} stone...`);
    // Mining logic here
    this.logger.info('Stone mining completed!');
  }
}

/**
 * Example food gathering task
 */
export class GatherFoodTask extends Task {
  constructor(type = 'wheat', count = 32) {
    super('gather_food', 65);
    this.foodType = type;
    this.targetCount = count;
  }

  async execute(bot) {
    this.logger.info(`Gathering ${this.targetCount} ${this.foodType}...`);
    // Gathering logic here
    this.logger.info('Food gathering completed!');
  }
}
