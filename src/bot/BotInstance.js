/**
 * Main bot instance managing Mineflayer connection and state
 */

import mineflayer from 'mineflayer';
import { Logger } from '../core/Logger.js';
import { StateManager } from './StateManager.js';
import { RecoveryManager } from './RecoveryManager.js';

const logger = new Logger('Bot');

/**
 * Main bot instance wrapping Mineflayer
 */
export class BotInstance {
  /**
   * Create bot instance
   * @param {Object} config
   * @param {EventBus} eventBus
   */
  constructor(config, eventBus) {
    this.config = config;
    this.events = eventBus;
    this.logger = logger.createChild('Instance');
    
    this.mineflayerBot = null;
    this.stateManager = new StateManager();
    this.recoveryManager = new RecoveryManager(this, config, eventBus);
    
    this.isConnected = false;
    this.connectionAttempts = 0;
  }

  /**
   * Connect to Minecraft server
   */
  async connect() {
    try {
      this.logger.info('Creating Mineflayer bot instance...');
      
      this.mineflayerBot = mineflayer.createBot({
        host: this.config.server.host,
        port: this.config.server.port,
        username: this.config.bot.username,
        password: this.config.bot.password || undefined,
        auth: this.config.bot.onlineMode ? 'microsoft' : 'offline',
        version: this.config.server.version,
      });

      // Setup event handlers
      this._setupEventHandlers();
      
      // Wait for login
      await this.events.wait('bot:login', 10000);
      this.logger.info('Bot logged in successfully');

    } catch (error) {
      this.logger.error('Connection failed:', error);
      throw error;
    }
  }

  /**
   * Setup Mineflayer event handlers
   * @private
   */
  _setupEventHandlers() {
    this.mineflayerBot.on('login', () => {
      this.isConnected = true;
      this.connectionAttempts = 0;
      this.stateManager.setConnected(true);
      this.logger.info('Logged in to server');
      this.events.emit('bot:login');
    });

    this.mineflayerBot.on('spawn', () => {
      this.stateManager.setSpawned(true);
      this.logger.info('Bot spawned');
      this.events.emit('bot:spawn');
    });

    this.mineflayerBot.on('death', () => {
      this.stateManager.setAlive(false);
      this.logger.info('Bot died');
      this.events.emit('bot:death');
    });

    this.mineflayerBot.on('end', (reason) => {
      this.isConnected = false;
      this.stateManager.setConnected(false);
      this.logger.info(`Connection ended: ${reason}`);
      this.events.emit('bot:disconnected', reason);
      
      if (this.config.behavior.autoReconnect) {
        this.recoveryManager.scheduleReconnect();
      }
    });

    this.mineflayerBot.on('error', (error) => {
      this.logger.error('Bot error:', error);
      this.events.emit('bot:error', error);
    });

    this.mineflayerBot.on('chat', (username, message) => {
      if (username !== this.mineflayerBot.username) {
        this.events.emit('bot:chat', { username, message });
      }
    });

    this.mineflayerBot.on('playerJoined', (player) => {
      this.logger.debug(`Player joined: ${player.username}`);
      this.events.emit('bot:playerJoined', player);
    });

    this.mineflayerBot.on('playerLeft', (player) => {
      this.logger.debug(`Player left: ${player.username}`);
      this.events.emit('bot:playerLeft', player);
    });
  }

  /**
   * Send chat message
   * @param {string} message
   */
  chat(message) {
    if (!this.mineflayerBot) throw new Error('Bot not connected');
    this.mineflayerBot.chat(message);
    this.logger.debug(`Sent chat: ${message}`);
  }

  /**
   * Get bot position
   * @returns {Object}
   */
  getPosition() {
    if (!this.mineflayerBot) return null;
    const pos = this.mineflayerBot.entity.position;
    return { x: pos.x, y: pos.y, z: pos.z };
  }

  /**
   * Get bot health
   * @returns {number}
   */
  getHealth() {
    if (!this.mineflayerBot) return 0;
    return this.mineflayerBot.health;
  }

  /**
   * Get bot hunger
   * @returns {number}
   */
  getHunger() {
    if (!this.mineflayerBot) return 0;
    return this.mineflayerBot.food;
  }

  /**
   * Get players
   * @returns {Array}
   */
  getPlayers() {
    if (!this.mineflayerBot) return [];
    return Array.from(this.mineflayerBot.players.values());
  }

  /**
   * Disconnect from server
   */
  disconnect() {
    if (this.mineflayerBot) {
      this.mineflayerBot.quit();
      this.logger.info('Disconnected from server');
    }
  }

  /**
   * Get raw Mineflayer bot
   * @returns {mineflayer.Bot}
   */
  getRaw() {
    return this.mineflayerBot;
  }
}
