/**
 * Command registry and execution
 */

import { Logger } from '../core/Logger.js';
import { CommandParser } from './CommandParser.js';

const logger = new Logger('CommandRegistry');

/**
 * Central command registry and executor
 */
export class CommandRegistry {
  /**
   * Create registry
   * @param {EventBus} eventBus
   * @param {Object} config
   */
  constructor(eventBus, config) {
    this.events = eventBus;
    this.commands = new Map();
    this.parser = new CommandParser(config?.commandPrefix || '!');
    this.logger = logger.createChild('Registry');
    this.commandHistory = [];
    this.maxHistorySize = 100;
  }

  /**
   * Register a command
   * @param {Command} command
   */
  register(command) {
    this.commands.set(command.name, command);
    
    // Register aliases
    for (const alias of command.aliases) {
      this.commands.set(alias, command);
    }
    
    this.logger.debug(`Registered command: ${command.name}`);
    this.events.emit('command:registered', command.getInfo());
  }

  /**
   * Unregister a command
   * @param {string} name
   */
  unregister(name) {
    const command = this.commands.get(name);
    if (command) {
      this.commands.delete(command.name);
      for (const alias of command.aliases) {
        this.commands.delete(alias);
      }
      this.logger.debug(`Unregistered command: ${name}`);
    }
  }

  /**
   * Get command by name
   * @param {string} name
   * @returns {Command|null}
   */
  get(name) {
    return this.commands.get(name) || null;
  }

  /**
   * Get all unique commands
   * @returns {Array}
   */
  getAll() {
    const unique = new Map();
    for (const [, command] of this.commands) {
      if (!unique.has(command.name)) {
        unique.set(command.name, command);
      }
    }
    return Array.from(unique.values());
  }

  /**
   * Execute command from chat message
   * @param {string} message
   * @param {BotInstance} bot
   * @param {Object} sender
   */
  async execute(message, bot, sender) {
    try {
      const parsed = this.parser.parse(message);
      if (!parsed) return;

      const command = this.get(parsed.command);
      if (!command) {
        this.logger.warn(`Unknown command: ${parsed.command}`);
        this.events.emit('command:notfound', parsed.command);
        return;
      }

      // Check permission
      if (sender.permission < command.permission) {
        this.logger.warn(`Permission denied for ${sender.username}: ${parsed.command}`);
        this.events.emit('command:permission_denied', {
          command: parsed.command,
          username: sender.username,
        });
        return;
      }

      // Validate arguments
      if (!command.validate(parsed.args)) {
        this.logger.warn(`Invalid arguments for command: ${parsed.command}`);
        this.events.emit('command:invalid_args', {
          command: parsed.command,
          args: parsed.args,
        });
        return;
      }

      this.logger.info(`Executing command: ${parsed.command}`, {
        args: parsed.args,
        username: sender.username,
      });

      await command.execute(bot, parsed.args, sender);
      
      this._recordCommand(parsed.command, sender.username);
      this.events.emit('command:executed', {
        command: parsed.command,
        username: sender.username,
        args: parsed.args,
      });

    } catch (error) {
      this.logger.error('Command execution error:', error);
      this.events.emit('command:error', {
        message,
        error: error.message,
      });
    }
  }

  /**
   * Record command execution
   * @private
   */
  _recordCommand(command, username) {
    this.commandHistory.push({
      command,
      username,
      timestamp: Date.now(),
    });
    if (this.commandHistory.length > this.maxHistorySize) {
      this.commandHistory.shift();
    }
  }

  /**
   * Get command history
   * @param {number} limit
   * @returns {Array}
   */
  getHistory(limit = 50) {
    return this.commandHistory.slice(-limit);
  }
}
