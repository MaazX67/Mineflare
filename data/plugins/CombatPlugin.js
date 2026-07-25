/**
 * Example combat plugin
 */

import { Plugin } from '../plugins/Plugin.js';
import { Behavior } from '../behaviors/Behavior.js';

class CombatBehavior extends Behavior {
  constructor() {
    super('AutoCombat', 90);
  }

  async think(bot) {
    // Auto-combat logic
  }
}

export class CombatPlugin extends Plugin {
  constructor() {
    super('CombatPlugin', '1.0.0');
  }

  async onLoad(api) {
    this.logger.info('Combat plugin loaded');
    
    // Register combat behavior
    await api.registerBehavior(new CombatBehavior());
    
    // Register combat commands
    api.registerCommand({
      name: 'combat',
      description: 'Enable combat mode',
      execute: async (bot, args) => {
        const action = args[0] || 'on';
        if (action === 'on') {
          api.combat.enable();
          bot.chat('Combat enabled!');
        } else {
          api.combat.disable();
          bot.chat('Combat disabled!');
        }
      },
    });
  }
}
