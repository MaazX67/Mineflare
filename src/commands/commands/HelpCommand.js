/**
 * Built-in help command
 */

import { Command } from '../Command.js';

/**
 * Help command showing available commands
 */
export class HelpCommand extends Command {
  constructor() {
    super('help', 'Show available commands', 0);
    this.aliases = ['h', '?'];
    this.usage = '[command]';
  }

  async execute(bot, args, sender) {
    if (args.length === 0) {
      // List all commands
      bot.chat('Available commands: !help [command]');
    } else {
      // Show specific command help
      const commandName = args[0].toLowerCase();
      bot.chat(`Help for command: ${commandName}`);
    }
  }
}
