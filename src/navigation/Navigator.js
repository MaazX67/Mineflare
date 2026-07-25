/**
 * Navigation system
 */

import { Logger } from '../core/Logger.js';
import { Movement } from './Movement.js';
import { ObstacleAvoidance } from './ObstacleAvoidance.js';

const logger = new Logger('Navigator');

/**
 * Main navigation system
 */
export class Navigator {
  /**
   * Create navigator
   * @param {EventBus} eventBus
   */
  constructor(eventBus) {
    this.events = eventBus;
    this.logger = logger.createChild('System');
    this.movement = new Movement();
    this.obstacles = new ObstacleAvoidance();
    this.waypoints = [];
  }

  /**
   * Navigate to position
   * @param {BotInstance} bot
   * @param {Object} target
   * @param {number} timeout
   */
  async navigateTo(bot, target, timeout = 30000) {
    try {
      const distance = this.movement.calculateDistance(bot.getPosition(), target);
      this.logger.info(`Navigating to target (${distance.toFixed(1)} blocks away)`);
      
      this.events.emit('navigation:started', { target, distance });
      
      await this.movement.moveTowards(bot, target, timeout);
      
      this.events.emit('navigation:completed', { target });
    } catch (error) {
      this.logger.error('Navigation failed:', error);
      this.events.emit('navigation:failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Add waypoint
   * @param {Object} position
   * @param {string} name
   */
  addWaypoint(position, name = null) {
    this.waypoints.push({
      name: name || `Waypoint ${this.waypoints.length + 1}`,
      position,
      timestamp: Date.now(),
    });
    this.logger.info(`Added waypoint: ${name}`);
  }

  /**
   * Get waypoint
   * @param {number} index
   * @returns {Object|null}
   */
  getWaypoint(index) {
    return this.waypoints[index] || null;
  }

  /**
   * Clear waypoints
   */
  clearWaypoints() {
    this.waypoints = [];
    this.logger.info('Waypoints cleared');
  }

  /**
   * Stop navigation
   */
  stop() {
    this.movement.stop();
    this.logger.info('Navigation stopped');
    this.events.emit('navigation:stopped');
  }
}
