/**
 * Built-in status command
 */

import { Command } from '../Command.js';

/**
 * Status command showing bot information
 */
export class StatusCommand extends Command {
  constructor() {
    super('status', 'Show bot status', 0);
    this.aliases = ['st', 'info'];
  }

  async execute(bot, args, sender) {
    const health = bot.getHealth();
    const hunger = bot.getHunger();
    const pos = bot.getPosition();
    
    bot.chat(`[Status] Health: ${health}/20 | Hunger: ${hunger}/20 | Pos: ${Math.floor(pos.x)}, ${Math.floor(pos.y)}, ${Math.floor(pos.z)}`);
  }
}
