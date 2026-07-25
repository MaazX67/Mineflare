/**
 * Plugin API interface
 */

import { Logger } from '../core/Logger.js';

const logger = new Logger('PluginAPI');

/**
 * API provided to plugins
 */
export class PluginAPI {
  /**
   * Create plugin API
   * @param {BotInstance} bot
   * @param {Object} managers
   */
  constructor(bot, managers) {
    this.bot = bot;
    this.commands = managers.commands;
    this.tasks = managers.tasks;
    this.behaviors = managers.behaviors;
    this.memory = managers.memory;
    this.navigation = managers.navigation;
    this.inventory = managers.inventory;
    this.combat = managers.combat;
    this.building = managers.building;
    this.events = managers.events;
    this.logger = logger.createChild('Interface');
  }

  /**
   * Register command
   * @param {Command} command
   */
  registerCommand(command) {
    this.commands.register(command);
  }

  /**
   * Register task
   * @param {Task} task
   */
  registerTask(task) {
    this.tasks.queue(task);
  }

  /**
   * Register behavior
   * @param {Behavior} behavior
   */
  async registerBehavior(behavior) {
    await this.behaviors.register(behavior);
  }

  /**
   * Register event listener
   * @param {string} event
   * @param {Function} handler
   */
  on(event, handler) {
    return this.events.on(event, handler);
  }

  /**
   * Listen to event once
   * @param {string} event
   * @param {Function} handler
   */
  once(event, handler) {
    return this.events.once(event, handler);
  }

  /**
   * Log message
   * @param {string} message
   * @param {any} data
   */
  log(message, data) {
    this.logger.info(message, data);
  }
}
