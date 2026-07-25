/**
 * Base Command class
 */

import { Logger } from '../core/Logger.js';

/**
 * Base class for all commands
 */
export class Command {
  /**
   * Create command
   * @param {string} name - Command name (lowercase, no spaces)
   * @param {string} description - Command description
   * @param {number} permission - Required permission level (0-10)
   */
  constructor(name, description, permission = 0) {
    if (!/^[a-z0-9_-]+$/.test(name)) {
      throw new Error('Command name must be lowercase alphanumeric with hyphens/underscores');
    }
    
    this.name = name;
    this.description = description;
    this.permission = Math.max(0, Math.min(10, permission));
    this.aliases = [];
    this.usage = '';
    this.logger = new Logger(`Command:${name}`);
  }

  /**
   * Execute command - override in subclass
   * @param {BotInstance} bot
   * @param {Array} args - Command arguments
   * @param {Object} sender - Command sender info
   */
  async execute(bot, args, sender) {
    throw new Error('execute() must be implemented in subclass');
  }

  /**
   * Validate command arguments
   * @param {Array} args
   * @returns {boolean}
   */
  validate(args) {
    return true;
  }

  /**
   * Get command info
   * @returns {Object}
   */
  getInfo() {
    return {
      name: this.name,
      description: this.description,
      aliases: this.aliases,
      usage: this.usage,
      permission: this.permission,
    };
  }
}
