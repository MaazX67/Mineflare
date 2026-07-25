/**
 * Build manager
 */

import { Logger } from '../core/Logger.js';
import { BuilderAI } from './BuilderAI.js';

const logger = new Logger('BuildManager');

/**
 * Manages building operations
 */
export class BuildManager {
  /**
   * Create build manager
   * @param {EventBus} eventBus
   */
  constructor(eventBus) {
    this.events = eventBus;
    this.logger = logger.createChild('Manager');
    this.builderAI = new BuilderAI();
    this.schematics = new Map();
  }

  /**
   * Register schematic
   * @param {string} name
   * @param {Schematic} schematic
   */
  registerSchematic(name, schematic) {
    this.schematics.set(name, schematic);
    this.logger.info(`Registered schematic: ${name}`);
  }

  /**
   * Get schematic
   * @param {string} name
   * @returns {Schematic|null}
   */
  getSchematic(name) {
    return this.schematics.get(name) || null;
  }

  /**
   * Start building
   * @param {BotInstance} bot
   * @param {string} schematicName
   * @param {Object} origin
   */
  async startBuild(bot, schematicName, origin) {
    const schematic = this.getSchematic(schematicName);
    if (!schematic) {
      throw new Error(`Schematic not found: ${schematicName}`);
    }

    this.logger.info(`Starting build: ${schematicName}`);
    this.events.emit('build:started', { schematic: schematicName, origin });
    
    try {
      await this.builderAI.build(bot, schematic, origin);
      this.events.emit('build:completed', { schematic: schematicName });
    } catch (error) {
      this.logger.error('Build failed:', error);
      this.events.emit('build:failed', { schematic: schematicName, error: error.message });
    }
  }

  /**
   * Cancel current build
   */
  cancelBuild() {
    this.builderAI.cancel();
    this.events.emit('build:cancelled');
  }

  /**
   * Get build status
   * @returns {Object}
   */
  getStatus() {
    return {
      isBuilding: this.builderAI.isBuilding,
      currentSchematic: this.builderAI.currentSchematic?.name || null,
      schematicCount: this.schematics.size,
    };
  }
}
