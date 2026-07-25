/**
 * Behavior engine managing bot behaviors
 */

import { Logger } from '../core/Logger.js';

const logger = new Logger('BehaviorEngine');

/**
 * Manages bot behaviors with priority-based thinking
 */
export class BehaviorEngine {
  /**
   * Create behavior engine
   * @param {EventBus} eventBus
   */
  constructor(eventBus) {
    this.events = eventBus;
    this.behaviors = new Map();
    this.activeBehaviors = new Set();
    this.logger = logger.createChild('Engine');
    this.isRunning = false;
    this.thinkInterval = 100; // ms between think cycles
  }

  /**
   * Register behavior
   * @param {Behavior} behavior
   */
  async register(behavior) {
    if (this.behaviors.has(behavior.name)) {
      throw new Error(`Behavior '${behavior.name}' already registered`);
    }
    
    this.behaviors.set(behavior.name, behavior);
    this.logger.info(`Registered behavior: ${behavior.name}`);
    this.events.emit('behavior:registered', behavior.getInfo());
  }

  /**
   * Unregister behavior
   * @param {string} name
   */
  async unregister(name) {
    const behavior = this.behaviors.get(name);
    if (behavior) {
      this.activeBehaviors.delete(name);
      this.behaviors.delete(name);
      this.logger.info(`Unregistered behavior: ${name}`);
    }
  }

  /**
   * Activate behavior
   * @param {string} name
   */
  activate(name) {
    const behavior = this.behaviors.get(name);
    if (!behavior) {
      throw new Error(`Behavior '${name}' not found`);
    }
    
    behavior.activate();
    this.activeBehaviors.add(name);
    this.logger.debug(`Activated behavior: ${name}`);
    this.events.emit('behavior:activated', name);
  }

  /**
   * Deactivate behavior
   * @param {string} name
   */
  deactivate(name) {
    const behavior = this.behaviors.get(name);
    if (behavior) {
      behavior.deactivate();
      this.activeBehaviors.delete(name);
      this.logger.debug(`Deactivated behavior: ${name}`);
      this.events.emit('behavior:deactivated', name);
    }
  }

  /**
   * Get behavior by name
   * @param {string} name
   * @returns {Behavior|null}
   */
  get(name) {
    return this.behaviors.get(name) || null;
  }

  /**
   * Get all behaviors
   * @returns {Array}
   */
  getAll() {
    return Array.from(this.behaviors.values());
  }

  /**
   * Get active behaviors
   * @returns {Array}
   */
  getActive() {
    return Array.from(this.activeBehaviors)
      .map((name) => this.behaviors.get(name))
      .filter((b) => b);
  }

  /**
   * Start behavior engine
   * @param {BotInstance} bot
   */
  async start(bot) {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.logger.info('Behavior engine started');
    
    // Initialize all behaviors
    for (const behavior of this.behaviors.values()) {
      try {
        await behavior.initialize(bot);
      } catch (error) {
        this.logger.error(`Failed to initialize ${behavior.name}:`, error);
      }
    }
    
    this._thinkLoop(bot);
  }

  /**
   * Stop behavior engine
   */
  async stop(bot) {
    this.isRunning = false;
    this.logger.info('Behavior engine stopped');
    
    // Cleanup all behaviors
    for (const behavior of this.behaviors.values()) {
      try {
        await behavior.cleanup(bot);
      } catch (error) {
        this.logger.error(`Failed to cleanup ${behavior.name}:`, error);
      }
    }
  }

  /**
   * Main thinking loop
   * @private
   */
  async _thinkLoop(bot) {
    while (this.isRunning) {
      try {
        const activeBehaviors = this.getActive()
          .sort((a, b) => b.priority - a.priority);
        
        for (const behavior of activeBehaviors) {
          try {
            behavior.lastThink = Date.now();
            await behavior.think(bot);
          } catch (error) {
            this.logger.error(`Error in behavior ${behavior.name}:`, error);
            this.events.emit('behavior:error', {
              behavior: behavior.name,
              error: error.message,
            });
          }
        }
      } catch (error) {
        this.logger.error('Think loop error:', error);
      }
      
      await this._sleep(this.thinkInterval);
    }
  }

  /**
   * Sleep utility
   * @private
   */
  _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
