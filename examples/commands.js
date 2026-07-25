/**
 * Example commands for Mineflare
 */

import { Command } from '../commands/Command.js';

/**
 * Example teleport command
 */
export class TeleportCommand extends Command {
  constructor() {
    super('goto', 'Teleport to coordinates', 5);
    this.aliases = ['tp', 'teleport'];
    this.usage = '<x> <y> <z>';
  }

  validate(args) {
    return args.length >= 3 && args.every((arg) => !isNaN(arg));
  }

  async execute(bot, args, sender) {
    const [x, y, z] = args.map(Number);
    bot.chat(`Teleporting to ${x}, ${y}, ${z}...`);
    // Would implement teleport logic in production
  }
}

/**
 * Example list command
 */
export class ListCommand extends Command {
  constructor() {
    super('list', 'List all players', 0);
    this.aliases = ['players', 'who'];
  }

  async execute(bot, args, sender) {
    const players = bot.getPlayers();
    if (players.length === 0) {
      bot.chat('No players online');
      return;
    }
    const names = players.map((p) => p.username).join(', ');
    bot.chat(`Players: ${names}`);
  }
}

/**
 * Example weather command
 */
export class WeatherCommand extends Command {
  constructor() {
    super('weather', 'Check weather', 0);
    this.usage = '<clear|rain|thunder>';
  }

  async execute(bot, args, sender) {
    const weather = args[0] || 'clear';
    bot.chat(`Setting weather to ${weather}...`);
    // Would implement weather changes in production
  }
}
