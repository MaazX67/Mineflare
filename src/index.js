/**
 * Main entry point for Mineflare bot
 */

import { BotManager } from './core/BotManager.js';
import { Logger } from './core/Logger.js';

const logger = new Logger('Main');

/**
 * Main application entry point
 */
async function main() {
  try {
    logger.info('🎮 Starting Mineflare...');
    
    // Create and initialize bot manager
    const manager = new BotManager();
    await manager.initialize();
    
    // Connect to server
    await manager.connect();
    
    logger.info('✅ Mineflare is running!');
    logger.info(`📊 Dashboard: http://localhost:${manager.config.dashboard.port}`);
    logger.info(`🔌 API: http://localhost:${manager.config.api.port}`);
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('🛑 Shutting down gracefully...');
      await manager.disconnect();
      process.exit(0);
    });
    
  } catch (error) {
    logger.error('Fatal error:', error);
    process.exit(1);
  }
}

// Start the bot
main();
