/**
 * Central Bot Manager
 */

import { Logger } from './Logger.js';
import { EventBus } from './EventBus.js';
import { loadConfig } from './ConfigLoader.js';
import { BotInstance } from '../bot/BotInstance.js';
import { StateManager } from '../bot/StateManager.js';
import { RecoveryManager } from '../bot/RecoveryManager.js';
import { TaskManager } from '../tasks/TaskManager.js';
import { CommandRegistry } from '../commands/CommandRegistry.js';
import { BehaviorEngine } from '../behaviors/BehaviorEngine.js';
import { MemoryManager } from '../memory/MemoryManager.js';
import { InventoryManager } from '../inventory/InventoryManager.js';
import { Navigator } from '../navigation/Navigator.js';
import { CombatManager } from '../combat/CombatManager.js';
import { BuildManager } from '../building/BuildManager.js';
import { PluginLoader } from '../plugins/PluginLoader.js';
import { PluginAPI } from '../plugins/PluginAPI.js';
import { APIServer } from '../api/APIServer.js';
import { DashboardServer } from '../dashboard/DashboardServer.js';

const logger = new Logger('BotManager');

/**
 * Central manager orchestrating all bot systems
 */
export class BotManager {
  /**
   * Create bot manager
   */
  constructor() {
    this.config = null;
    this.events = new EventBus();
    this.logger = logger.createChild('Manager');
    
    // Bot systems
    this.bot = null;
    this.state = null;
    this.recovery = null;
    
    // Feature managers
    this.tasks = null;
    this.commands = null;
    this.behaviors = null;
    this.memory = null;
    this.inventory = null;
    this.navigation = null;
    this.combat = null;
    this.building = null;
    this.plugins = null;
    
    // Servers
    this.apiServer = null;
    this.dashboardServer = null;
  }

  /**
   * Initialize all systems
   */
  async initialize() {
    try {
      this.logger.info('Initializing Mineflare...');
      
      // Load configuration
      this.config = await loadConfig();
      
      // Initialize memory first (needed by other systems)
      this.memory = new MemoryManager(this.events, this.config);
      await this.memory.initialize();
      
      // Initialize managers
      this.tasks = new TaskManager(this.events, this.config);
      this.commands = new CommandRegistry(this.events, this.config);
      this.behaviors = new BehaviorEngine(this.events);
      this.inventory = new InventoryManager(this.events);
      this.navigation = new Navigator(this.events);
      this.combat = new CombatManager(this.events);
      this.building = new BuildManager(this.events);
      this.plugins = new PluginLoader(this.config);
      
      // Initialize bot systems
      this.bot = new BotInstance(this.config, this.events);
      this.state = new StateManager(this.events);
      this.recovery = new RecoveryManager(this.config, this.events);
      
      // Initialize servers
      if (this.config.api.enabled) {
        this.apiServer = new APIServer(this.config);
      }
      if (this.config.dashboard.enabled) {
        this.dashboardServer = new DashboardServer(this.config);
      }
      
      // Load built-in commands
      this._loadBuiltInCommands();
      
      // Load plugins if auto-load enabled
      if (this.config.plugins.autoLoad) {
        await this._loadPlugins();
      }
      
      this.logger.info('✅ Initialization complete');
    } catch (error) {
      this.logger.error('Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Connect to Minecraft server
   */
  async connect() {
    try {
      this.logger.info(`🔗 Connecting to ${this.config.server.host}:${this.config.server.port}...`);
      
      // Start servers
      if (this.apiServer) await this.apiServer.start();
      if (this.dashboardServer) await this.dashboardServer.start(this);
      
      // Start managers
      this.tasks.start();
      await this.behaviors.start(this.bot);
      
      // Connect bot
      await this.bot.connect(
        this.config.server.host,
        this.config.server.port,
        this.config.bot.username
      );
      
      this.events.emit('manager:ready');
      this.logger.info('✅ Connected and ready');
    } catch (error) {
      this.logger.error('Connection failed:', error);
      throw error;
    }
  }

  /**
   * Disconnect from server
   */
  async disconnect() {
    try {
      this.logger.info('Disconnecting...');
      
      await this.behaviors.stop(this.bot);
      this.tasks.stop();
      await this.bot.disconnect();
      await this.memory.save();
      
      if (this.apiServer) await this.apiServer.stop();
      if (this.dashboardServer) await this.dashboardServer.stop();
      
      this.logger.info('✅ Disconnected');
    } catch (error) {
      this.logger.error('Disconnect error:', error);
    }
  }

  /**
   * Load built-in commands
   * @private
   */
  _loadBuiltInCommands() {
    const { HelpCommand } = require('../commands/commands/HelpCommand.js');
    const { StatusCommand } = require('../commands/commands/StatusCommand.js');
    const { EchoCommand } = require('../commands/commands/EchoCommand.js');
    
    this.commands.register(new HelpCommand());
    this.commands.register(new StatusCommand());
    this.commands.register(new EchoCommand());
    
    this.logger.info('Built-in commands loaded');
  }

  /**
   * Load plugins
   * @private
   */
  async _loadPlugins() {
    try {
      const pluginAPI = new PluginAPI(this.bot, {
        commands: this.commands,
        tasks: this.tasks,
        behaviors: this.behaviors,
        memory: this.memory,
        navigation: this.navigation,
        inventory: this.inventory,
        combat: this.combat,
        building: this.building,
        events: this.events,
      });
      
      await this.plugins.loadFromDirectory(this.config.plugins.path);
      
      for (const plugin of this.plugins.getAll()) {
        await this.plugins.load(plugin, pluginAPI);
      }
      
      this.logger.info(`Loaded ${this.plugins.getAll().length} plugins`);
    } catch (error) {
      this.logger.warn('Plugin loading error:', error);
    }
  }

  /**
   * Get current status
   * @returns {Object}
   */
  getStatus() {
    return {
      bot: {
        username: this.bot?.getName(),
        position: this.bot?.getPosition(),
        health: this.bot?.getHealth(),
        hunger: this.bot?.getHunger(),
        connected: this.bot?.isConnected(),
      },
      managers: {
        tasks: this.tasks.getStatus(),
        behaviors: {
          active: this.behaviors.getActive().map((b) => b.name),
          total: this.behaviors.getAll().length,
        },
        inventory: this.inventory.getInfo(),
        memory: this.memory.getStats(),
      },
      plugins: this.plugins.getEnabled().map((p) => p.getInfo()),
    };
  }
}
