/**
 * Example farming plugin
 */

import { Plugin } from '../plugins/Plugin.js';
import { Task } from '../tasks/Task.js';

class FarmingTask extends Task {
  constructor() {
    super('farming', 80);
  }

  async execute(bot) {
    this.logger.info('Farming task executing...');
    // Farming logic here
  }
}

export class FarmingPlugin extends Plugin {
  constructor() {
    super('FarmingPlugin', '1.0.0');
  }

  async onLoad(api) {
    this.logger.info('Farming plugin loaded');
    
    // Register custom command
    api.registerCommand({
      name: 'farm',
      description: 'Start farming',
      execute: async (bot, args) => {
        api.registerTask(new FarmingTask());
        bot.chat('Farming started!');
      },
    });
  }

  async onUnload(api) {
    this.logger.info('Farming plugin unloaded');
  }
}
