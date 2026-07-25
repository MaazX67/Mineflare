/**
 * Bot state management
 */

import { Logger } from '../core/Logger.js';

const logger = new Logger('StateManager');

/**
 * Manages bot state and properties
 */
export class StateManager {
  constructor() {
    this.state = {
      connected: false,
      spawned: false,
      alive: true,
      dimension: 'overworld',
      gamemode: 'survival',
      position: { x: 0, y: 0, z: 0 },
      health: 20,
      hunger: 20,
      inventory: {},
      currentTask: null,
      taskQueue: [],
    };
  }

  /**
   * Update state
   * @param {string} key
   * @param {any} value
   */
  set(key, value) {
    this.state[key] = value;
    logger.debug(`State updated: ${key} = ${JSON.stringify(value)}`);
  }

  /**
   * Get state value
   * @param {string} key
   * @returns {any}
   */
  get(key) {
    return this.state[key];
  }

  /**
   * Get entire state
   * @returns {Object}
   */
  getAll() {
    return JSON.parse(JSON.stringify(this.state));
  }

  /**
   * Set connected state
   * @param {boolean} connected
   */
  setConnected(connected) {
    this.set('connected', connected);
  }

  /**
   * Set spawned state
   * @param {boolean} spawned
   */
  setSpawned(spawned) {
    this.set('spawned', spawned);
  }

  /**
   * Set alive state
   * @param {boolean} alive
   */
  setAlive(alive) {
    this.set('alive', alive);
  }

  /**
   * Update position
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  updatePosition(x, y, z) {
    this.set('position', { x, y, z });
  }

  /**
   * Update health
   * @param {number} health
   */
  updateHealth(health) {
    this.set('health', Math.max(0, Math.min(20, health)));
  }

  /**
   * Update hunger
   * @param {number} hunger
   */
  updateHunger(hunger) {
    this.set('hunger', Math.max(0, Math.min(20, hunger)));
  }
}
