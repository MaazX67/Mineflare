/**
 * Mineflare Examples - Getting Started
 */

This directory contains example code for using Mineflare framework.

## Files

### behaviors.js
Example bot behaviors:
- **IdleBehavior**: Simple idle behavior that looks around
- **SelfPreservationBehavior**: Keeps the bot alive by running from danger and eating

### commands.js
Example custom commands:
- **TeleportCommand**: `/goto x y z` - Teleport to coordinates
- **ListCommand**: `/list` - List all online players
- **WeatherCommand**: `/weather` - Change weather

### tasks.js
Example tasks:
- **GatherWoodTask**: Gather wood blocks
- **MineStoneTask**: Mine stone blocks
- **GatherFoodTask**: Gather food items

## Usage Examples

### Creating a Custom Behavior

```javascript
import { Behavior } from '../src/behaviors/Behavior.js';

class MyBehavior extends Behavior {
  constructor() {
    super('MyBehavior', 50); // name, priority
  }

  async think(bot) {
    // Decision-making logic
  }
}
```

### Registering a Command

```javascript
import { Command } from '../src/commands/Command.js';

class MyCommand extends Command {
  constructor() {
    super('mycommand', 'Description', 0); // name, description, permission
  }

  validate(args) {
    return args.length > 0;
  }

  async execute(bot, args, sender) {
    bot.chat(`Hello ${sender.username}!`);
  }
}

manager.commands.register(new MyCommand());
```

### Creating a Task

```javascript
import { Task } from '../src/tasks/Task.js';

class MyTask extends Task {
  constructor() {
    super('mytask', 75); // name, priority
  }

  async execute(bot) {
    this.logger.info('Task executing...');
    // Task logic
  }
}

manager.tasks.queue(new MyTask());
```

### Loading from Main Bot

```javascript
import { BotManager } from './src/core/BotManager.js';
import { IdleBehavior } from './examples/behaviors.js';
import { TeleportCommand } from './examples/commands.js';
import { GatherWoodTask } from './examples/tasks.js';

const manager = new BotManager();
await manager.initialize();

// Register example behavior
await manager.behaviors.register(new IdleBehavior());
manager.behaviors.activate('IdleBehavior');

// Register example command
manager.commands.register(new TeleportCommand());

// Queue example task
manager.tasks.queue(new GatherWoodTask(64));

await manager.connect();
```

## Tips

1. **Priorities**: Higher priority values execute first
   - 0-30: Low priority (idle, maintenance)
   - 30-70: Normal priority (regular tasks)
   - 70-100: High priority (important behaviors)

2. **Event Listeners**: Listen to bot events
   ```javascript
   manager.events.on('bot:death', () => {
     console.log('Bot died!');
   });
   ```

3. **Memory**: Store persistent data
   ```javascript
   manager.memory.set('last_home', { x: 0, y: 0, z: 0 });
   const home = manager.memory.get('last_home');
   ```

4. **Navigation**: Move the bot
   ```javascript
   await manager.navigation.navigateTo(bot, { x: 100, y: 64, z: 100 });
   ```

5. **Inventory**: Manage items
   ```javascript
   const woodCount = manager.inventory.getItemCount('oak_log');
   ```

## More Information

See `README.md` for full documentation and API reference.
