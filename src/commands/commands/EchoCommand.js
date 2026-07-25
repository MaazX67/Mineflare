/**
 * Built-in echo command
 */

import { Command } from '../Command.js';

/**
 * Echo command for testing
 */
export class EchoCommand extends Command {
  constructor() {
    super('echo', 'Echo a message', 0);
    this.usage = '<message>';
  }

  validate(args) {
    return args.length > 0;
  }

  async execute(bot, args, sender) {
    const message = args.join(' ');
    bot.chat(`${sender.username}: ${message}`);
  }
}
