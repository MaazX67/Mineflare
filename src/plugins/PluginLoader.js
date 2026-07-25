/**
 * Plugin loader and manager
 */

import { Logger } from '../core/Logger.js';
import { readdir } from 'fs/promises';
import { join } from 'path';

const logger = new Logger('PluginLoader');

/**
 * Loads and manages plugins
 */
export class PluginLoader {
  /**
   * Create plugin loader
   * @param {Object} config
   */
  constructor(config) {
    this.config = config;
    this.logger = logger.createChild('Loader');
    this.plugins = new Map();
  }

  /**
   * Load plugins from directory
   * @param {string} path
   */
  async loadFromDirectory(path) {
    try {
      this.logger.info(`Loading plugins from: ${path}`);
      
      const files = await readdir(path);
      const jsFiles = files.filter((f) => f.endsWith('.js'));

      for (const file of jsFiles) {
        try {
          const filePath = join(path, file);
          const module = await import(`file://${filePath}`);
          
          // Assuming exported class is default export
          const PluginClass = module.default || Object.values(module)[0];
          if (PluginClass && typeof PluginClass === 'function') {
            const instance = new PluginClass();
            this.plugins.set(instance.name, instance);
            this.logger.info(`Loaded plugin: ${instance.name}`);
          }
        } catch (error) {
          this.logger.warn(`Failed to load plugin ${file}:`, error.message);
        }
      }
    } catch (error) {
      this.logger.error(`Failed to load plugins from ${path}:`, error);
    }
  }

  /**
   * Load specific plugin
   * @param {Plugin} plugin
   */
  async load(plugin, api) {
    try {
      await plugin.onLoad(api);
      plugin.enabled = true;
      this.plugins.set(plugin.name, plugin);
      this.logger.info(`Loaded plugin: ${plugin.name}`);
    } catch (error) {
      this.logger.error(`Failed to load plugin ${plugin.name}:`, error);
      throw error;
    }
  }

  /**
   * Unload plugin
   * @param {string} name
   */
  async unload(name, api) {
    const plugin = this.plugins.get(name);
    if (!plugin) return;

    try {
      await plugin.onUnload(api);
      plugin.enabled = false;
      this.logger.info(`Unloaded plugin: ${name}`);
    } catch (error) {
      this.logger.error(`Failed to unload plugin ${name}:`, error);
    }
  }

  /**
   * Get plugin
   * @param {string} name
   * @returns {Plugin|null}
   */
  get(name) {
    return this.plugins.get(name) || null;
  }

  /**
   * Get all plugins
   * @returns {Array}
   */
  getAll() {
    return Array.from(this.plugins.values());
  }

  /**
   * Get enabled plugins
   * @returns {Array}
   */
  getEnabled() {
    return Array.from(this.plugins.values()).filter((p) => p.enabled);
  }
}
