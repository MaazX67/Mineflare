/**
 * Command parser for parsing chat messages
 */

import { Logger } from '../core/Logger.js';

const logger = new Logger('CommandParser');

/**
 * Parses chat messages into commands
 */
export class CommandParser {
  /**
   * Create parser
   * @param {string} prefix - Command prefix (default: '!')
   */
  constructor(prefix = '!') {
    this.prefix = prefix;
  }

  /**
   * Parse chat message
   * @param {string} message
   * @returns {Object|null}
   */
  parse(message) {
    if (!message.startsWith(this.prefix)) {
      return null;
    }

    const content = message.slice(this.prefix.length).trim();
    if (!content) return null;

    const parts = content.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    return {
      command,
      args,
      raw: content,
    };
  }

  /**
   * Check if message is a command
   * @param {string} message
   * @returns {boolean}
   */
  isCommand(message) {
    return message.startsWith(this.prefix);
  }
}
