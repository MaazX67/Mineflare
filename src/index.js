/**
 * Mineflare - Professional Minecraft Automation Framework
 * Entry point for the application
 */

import { BotManager } from './core/BotManager.js';
import { Logger } from './core/Logger.js';

const logger = new Logger('Mineflare');

/**
 * Initialize and start the Mineflare framework
 */
async function main() {
  try {
    logger.info('Starting Mineflare v1.0.0...');
    
    const manager = new BotManager();
    
    // Initialize configuration and systems
    await manager.initialize();
    logger.info('Systems initialized successfully');
    
    // Connect to server
    await manager.connect();
    logger.info('Connected to Minecraft server');
    
    // Keep process alive
    process.on('SIGINT', async () => {
      logger.info('Shutdown signal received');
      await manager.shutdown();
      process.exit(0);
    });
    
  } catch (error) {
    logger.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
