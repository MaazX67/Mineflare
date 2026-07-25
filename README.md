# Mineflare v1.0

**Professional Minecraft Automation Framework** built with Node.js and Mineflayer.

Mineflare is an enterprise-grade, production-ready framework for creating intelligent Minecraft bots with clean architecture, modular design, and exceptional scalability.

## ✨ Features

- **Clean Architecture**: Modular, maintainable, and extensible codebase
- **ES Modules**: Modern JavaScript with async/await throughout
- **Event-Driven**: Pub/sub architecture for decoupled components
- **Plugin System**: Extend functionality without modifying core
- **Task Manager**: Prioritized task execution with cancellation support
- **Memory System**: Persistent storage for learned behaviors and data
- **Navigation**: Pathfinding with obstacle avoidance
- **Combat System**: Autonomous PvE/PvP with configurable strategies
- **Building System**: Schematic support and structure building
- **Inventory Management**: Automatic organization and crafting
- **Dashboard**: Real-time web UI with live status monitoring
- **Behavior Engine**: Deterministic AI without cloud APIs
- **Automatic Reconnect**: Recovery from disconnections
- **Production Logging**: Structured logging with Pino
- **Cross-Platform**: Works on Windows, macOS, Linux

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher (LTS recommended)
- **npm**: v9.0.0 or higher
- **Minecraft Server**: 1.16 - 1.20.x compatible
- **Java**: For running Minecraft servers locally (optional)

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/MaazX67/Mineflare.git
cd Mineflare

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env
```

### Configuration

Edit `.env` with your server details:

```env
# Server Configuration
SERVER_HOST=localhost
SERVER_PORT=25565
BOT_USERNAME=Mineflare
BOT_PASSWORD=

# Optional: Authentication
AUTH_TYPE=microsoft
MICROSOFT_EMAIL=your-email@example.com
MICROSOFT_PASSWORD=your-password

# Logging
LOG_LEVEL=info
LOG_FILE=./data/logs/bot.log

# Dashboard
DASHBOARD_PORT=3000
DASHBOARD_ENABLED=true

# Behavior
AUTO_RECONNECT=true
RECONNECT_DELAY=5000
MAX_RECONNECT_ATTEMPTS=10
```

### Running the Bot

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Run with specific configuration
NODE_ENV=production npm start
```

## 📁 Project Structure

```
Mineflare/
├── src/
│   ├── index.js                 # Application entry point
│   ├── core/
│   │   ├── index.js            # Core exports
│   │   ├── BotManager.js       # Central bot lifecycle
│   │   ├── EventBus.js         # Event pub/sub system
│   │   ├── ConfigLoader.js     # Configuration management
│   │   └── Logger.js           # Structured logging
│   ├── bot/
│   │   ├── index.js            # Bot initialization
│   │   ├── BotInstance.js      # Main bot class
│   │   ├── StateManager.js     # Bot state tracking
│   │   └── RecoveryManager.js  # Reconnection & recovery
│   ├── commands/
│   │   ├── index.js            # Command registry
│   │   ├── CommandParser.js    # Command parsing
│   │   └── commands/           # Individual command files
│   ├── tasks/
│   │   ├── index.js            # Task system
│   │   ├── TaskManager.js      # Task execution engine
│   │   ├── TaskQueue.js        # Priority queue
│   │   └── tasks/              # Task implementations
│   ├── behaviors/
│   │   ├── index.js            # Behavior exports
│   │   ├── BehaviorEngine.js   # AI behavior system
│   │   └── behaviors/          # Individual behaviors
│   ├── combat/
│   │   ├── index.js            # Combat system
│   │   ├── CombatManager.js    # Combat coordination
│   │   ├── PvEController.js    # PvE strategies
│   │   └── PvPController.js    # PvP strategies
│   ├── building/
│   │   ├── index.js            # Building system
│   │   ├── BuildManager.js     # Build coordination
│   │   ├── Schematic.js        # Schematic parser
│   │   └── BuilderAI.js        # Building logic
│   ├── inventory/
│   │   ├── index.js            # Inventory system
│   │   ├── InventoryManager.js # Inventory operations
│   │   ├── StorageManager.js   # Chest/storage
│   │   └── CraftingEngine.js   # Crafting logic
│   ├── navigation/
│   │   ├── index.js            # Navigation system
│   │   ├── Navigator.js        # Pathfinding
│   │   ├── Movement.js         # Movement control
│   │   └── ObstacleAvoidance.js # Obstacle detection
│   ├── memory/
│   │   ├── index.js            # Memory system
│   │   ├── MemoryManager.js    # Memory operations
│   │   ├── KnowledgeBase.js    # Persistent storage
│   │   └── EntityMemory.js     # Entity tracking
│   ├── plugins/
│   │   ├── index.js            # Plugin system
│   │   ├── PluginLoader.js     # Plugin discovery
│   │   ├── PluginAPI.js        # Plugin interface
│   │   └── plugins/            # Built-in plugins
│   ├── api/
│   │   ├── index.js            # API exports
│   │   ├── APIServer.js        # Express server
│   │   ├── routes/             # API endpoints
│   │   └── middleware/         # Express middleware
│   ├── dashboard/
│   │   ├── index.js            # Dashboard exports
│   │   ├── DashboardServer.js  # WebSocket server
│   │   └── handlers/           # Socket handlers
│   ├── utils/
│   │   ├── index.js            # Utils exports
│   │   ├── constants.js        # Game constants
│   │   ├── helpers.js          # Utility functions
│   │   ├── math.js             # Math utilities
│   │   └── validators.js       # Input validation
│   └── config/
│       ├── index.js            # Config exports
│       ├── default.js          # Default config
│       └── schemas.js          # Config validation
├── public/                      # Web dashboard (frontend)
├── data/
│   ├── logs/                   # Application logs
│   ├── memory/                 # Persistent memory
│   └── plugins/                # Plugin directory
├── tests/                       # Unit tests
├── docs/                        # Documentation
├── scripts/                     # Setup and utility scripts
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── .eslintrc.json              # ESLint config
├── .prettierrc                 # Prettier config
├── package.json                # Dependencies
└── LICENSE                     # MIT License
```

## 🏗️ Architecture

### Core Components

**EventBus**: Central pub/sub system for inter-component communication
```javascript
bot.events.on('bot:ready', () => console.log('Bot connected'));
bot.events.emit('task:started', taskData);
```

**TaskManager**: Prioritized task execution with cancellation
```javascript
bot.tasks.queue(new NavigationTask({ target }), 10);
bot.tasks.cancel(taskId);
```

**BehaviorEngine**: Deterministic AI using state machines
```javascript
bot.behaviors.register(new FollowBehavior());
bot.behaviors.activate('follow');
```

**MemoryManager**: Persistent storage for learning
```javascript
bot.memory.set('player_homes', locations);
const homes = bot.memory.get('player_homes');
```

**PluginSystem**: Extensible architecture
```javascript
const plugin = new MyPlugin();
bot.plugins.register(plugin);
```

## 🎮 Usage Examples

### Basic Bot

```javascript
import { BotManager } from './src/core/BotManager.js';

const manager = new BotManager();
await manager.initialize();
await manager.connect();
```

### Custom Command

```javascript
import { Command } from './src/commands/Command.js';

class GreetCommand extends Command {
  constructor() {
    super('greet', 'Greet a player');
  }

  async execute(bot, player) {
    bot.chat(`Hello ${player.username}!`);
  }
}
```

### Custom Task

```javascript
import { Task } from './src/tasks/Task.js';

class MiningTask extends Task {
  constructor(block) {
    super('mining', 5);
    this.block = block;
  }

  async execute(bot) {
    await bot.dig(this.block);
  }
}
```

### Custom Behavior

```javascript
import { Behavior } from './src/behaviors/Behavior.js';

class PatrolBehavior extends Behavior {
  constructor() {
    super('patrol');
  }

  async think(bot) {
    // Deterministic decision logic
    const target = bot.nearestEntity();
    if (target) {
      await bot.navigate(target.position);
    }
  }
}
```

## 📊 Dashboard

Access the web dashboard at `http://localhost:3000`:

- **Status**: Real-time health, hunger, position
- **Inventory**: Live inventory display
- **Map**: 2D minimap with entities
- **Tasks**: Active and queued tasks
- **Logs**: Real-time bot logs
- **Console**: Command execution
- **Plugins**: Manage plugins
- **Settings**: Configure behavior

## 🔌 Plugin Development

Create custom plugins in `data/plugins/`:

```javascript
import { Plugin } from '../src/plugins/Plugin.js';

export class MyPlugin extends Plugin {
  constructor() {
    super('my-plugin', '1.0.0');
  }

  async onLoad(bot) {
    bot.logger.info('Plugin loaded');
    bot.commands.register(new MyCommand());
  }

  async onUnload(bot) {
    bot.logger.info('Plugin unloaded');
  }
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Lint code
npm run lint

# Format code
npm run format
```

## 📚 Documentation

Detailed documentation available in `/docs`:

- [Architecture Guide](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Plugin Development](./docs/PLUGINS.md)
- [Task System](./docs/TASKS.md)
- [Behavior Engine](./docs/BEHAVIORS.md)
- [Command System](./docs/COMMANDS.md)
- [Memory System](./docs/MEMORY.md)
- [Navigation Guide](./docs/NAVIGATION.md)
- [Combat System](./docs/COMBAT.md)
- [Building System](./docs/BUILDING.md)

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Follow the code style
4. Write tests for new features
5. Submit a pull request

## 📋 Code Style

- **ESLint**: Configuration in `.eslintrc.json`
- **Prettier**: Auto-formatting enabled
- **JSDoc**: Comprehensive documentation
- **Async/Await**: No callbacks or promises
- **Error Handling**: Try/catch with logging

## 📦 Dependencies

- **mineflayer**: Minecraft bot framework
- **mineflayer-pathfinder**: Pathfinding support
- **mineflayer-pvp**: PvP utilities
- **express**: REST API server
- **socket.io**: Real-time dashboard
- **pino**: Structured logging
- **dotenv**: Environment configuration

## ⚖️ License

MIT License - see [LICENSE](./LICENSE) file

## 🙏 Acknowledgments

- [Mineflayer](https://github.com/PrismarineJS/mineflayer) - Core bot library
- [PrismarineJS](https://github.com/PrismarineJS) - Minecraft protocol libraries
- Community contributors

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/MaazX67/Mineflare/issues)
- **Discussions**: [GitHub Discussions](https://github.com/MaazX67/Mineflare/discussions)
- **Documentation**: See `/docs` folder

---

**Status**: Active Development | **Version**: 1.0.0 | **License**: MIT
