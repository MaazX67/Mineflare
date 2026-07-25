/**
 * Base Plugin class
 */

import { Logger } from '../core/Logger.js';

/**
 * Base class for all plugins
 */
export class Plugin {
  /**
   * Create plugin
   * @param {string} name - Plugin name
   * @param {string} version - Plugin version
   */
  constructor(name, version = '1.0.0') {
    this.name = name;
    this.version = version;
    this.enabled = false;
    this.logger = new Logger(`Plugin:${name}`);
  }

  /**
   * Called when plugin loads
   * @param {PluginAPI} api
   */
  async onLoad(api) {
    this.logger.info('Plugin loaded');
  }

  /**
   * Called when plugin unloads
   * @param {PluginAPI} api
   */
  async onUnload(api) {
    this.logger.info('Plugin unloaded');
  }

  /**
   * Called when bot connects
   * @param {PluginAPI} api
   */
  async onBotConnect(api) {
    // Override in subclass
  }

  /**
   * Called when bot disconnects
   * @param {PluginAPI} api
   */
  async onBotDisconnect(api) {
    // Override in subclass
  }

  /**
   * Get plugin info
   * @returns {Object}
   */
  getInfo() {
    return {
      name: this.name,
      version: this.version,
      enabled: this.enabled,
    };
  }
}
