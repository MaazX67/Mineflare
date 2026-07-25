/**
 * Example mining plugin
 */

import { Plugin } from '../plugins/Plugin.js';
import { Task } from '../tasks/Task.js';

class MiningTask extends Task {
  constructor(targetBlock) {
    super('mining', 85);
    this.targetBlock = targetBlock;
  }

  async execute(bot) {
    this.logger.info(`Mining ${this.targetBlock}...`);
    // Mining logic here
  }
}

export class MiningPlugin extends Plugin {
  constructor() {
    super('MiningPlugin', '1.0.0');
  }

  async onLoad(api) {
    this.logger.info('Mining plugin loaded');
    
    // Register mining command
    api.registerCommand({
      name: 'mine',
      description: 'Start mining',
      execute: async (bot, args) => {
        const block = args[0] || 'stone';
        api.registerTask(new MiningTask(block));
        bot.chat(`Mining ${block}!`);
      },
    });
  }
}
