# Mineflare - Professional Minecraft Automation Framework

![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

A professional-grade, feature-rich Minecraft bot automation framework built with Mineflayer. Mineflare provides a comprehensive toolkit for creating intelligent, autonomous bots with advanced capabilities.

## Features

### Core Systems
- **Event-Driven Architecture**: Central event bus for inter-component communication
- **Task Management**: Priority-based task queue system
- **Behavior Engine**: Autonomous decision-making system
- **Command System**: Extensible command registry with permission levels
- **Memory Management**: Persistent knowledge base with runtime memory

### Bot Capabilities
- **Navigation**: Pathfinding and obstacle avoidance
- **Inventory Management**: Item tracking and storage system
- **Combat**: PvE and PvP combat controllers
- **Building**: Automated building and schematic support
- **Crafting**: Recipe management and crafting engine

### Infrastructure
- **Plugin System**: Dynamic plugin loading and management
- **REST API**: Express-based API server
- **Real-time Dashboard**: Socket.IO powered web dashboard
- **Structured Logging**: Pino-based logging with pretty printing
- **Configuration Management**: Environment variable support

## Quick Start

### Installation

```bash
git clone https://github.com/MaazX67/Mineflare.git
cd Mineflare
npm install
```

### Configuration

Create a `.env` file in the root directory:

```env
SERVER_HOST=localhost
SERVER_PORT=25565
BOT_USERNAME=Mineflare
BOT_ONLINE_MODE=false
LOG_LEVEL=info
DASHBOARD_ENABLED=true
DASHBOARD_PORT=3000
API_ENABLED=true
API_PORT=3001
```

### Running

```bash
# Start the bot
npm start

# Development mode with auto-reload
npm run dev
```

## Project Structure

```
Mineflare/
├── src/
│   ├── index.js              # Entry point
│   ├── core/                 # Core systems
│   │   ├── Logger.js         # Structured logging
│   │   ├── EventBus.js       # Event system
│   │   ├── ConfigLoader.js   # Configuration
│   │   └── BotManager.js     # Central manager
│   ├── bot/                  # Bot implementation
│   │   ├── BotInstance.js    # Mineflayer wrapper
│   │   ├── StateManager.js   # Bot state
│   │   └── RecoveryManager.js# Reconnection logic
│   ├── tasks/                # Task system
│   ├── commands/             # Command system
│   ├── behaviors/            # Behavior engine
│   ├── memory/               # Memory management
│   ├── inventory/            # Inventory system
│   ├── navigation/           # Navigation system
│   ├── combat/               # Combat systems
│   ├── building/             # Building system
│   ├── plugins/              # Plugin system
│   ├── api/                  # API server
│   ├── dashboard/            # Dashboard server
│   ├── config/               # Configuration
│   └── utils/                # Utilities
├── data/
│   ├── logs/                 # Log files
│   ├── memory/               # Persistent memory
│   └── plugins/              # Plugin directory
├── package.json
├── .env.example
└── README.md
```

## Usage Examples

### Basic Bot Setup

```javascript
import { BotManager } from './src/core/BotManager.js';

const manager = new BotManager();
await manager.initialize();
await manager.connect();
```

### Creating a Custom Command

```javascript
import { Command } from './src/commands/Command.js';

class MyCommand extends Command {
  constructor() {
    super('mycommand', 'My custom command', 0);
  }

  async execute(bot, args, sender) {
    bot.chat(`Hello ${sender.username}!`);
  }
}

manager.commands.register(new MyCommand());
```

### Creating a Custom Behavior

```javascript
import { Behavior } from './src/behaviors/Behavior.js';

class MyBehavior extends Behavior {
  constructor() {
    super('MyBehavior', 75);
  }

  async think(bot) {
    // AI logic here
  }
}

await manager.behaviors.register(new MyBehavior());
manager.behaviors.activate('MyBehavior');
```

### Creating a Plugin

```javascript
import { Plugin } from './src/plugins/Plugin.js';

export class MyPlugin extends Plugin {
  constructor() {
    super('MyPlugin', '1.0.0');
  }

  async onLoad(api) {
    api.log('MyPlugin loaded!');
    // Set up plugin features
  }
}
```

## Systems Overview

### Event Bus
Central event system for component communication:
- `bot:login` - Bot logged in
- `bot:spawn` - Bot spawned
- `bot:death` - Bot died
- `bot:chat` - Chat message received
- `command:executed` - Command executed
- `task:completed` - Task completed
- And many more...

### Task System
Priority-based task queue with execution management:
- Queue tasks with priority levels
- Automatic execution in order
- Task history tracking
- Event emission on completion

### Behavior Engine
Autonomous decision-making system:
- Register multiple behaviors
- Priority-based execution
- Activate/deactivate behaviors
- State management

### Command System
Extensible command framework:
- Chat command parsing with prefix
- Permission levels (0-10)
- Command aliases
- Validation and error handling

### Memory System
Persistent and runtime memory:
- Persistent knowledge base
- In-memory runtime storage
- Automatic serialization
- Knowledge base saving/loading

## Configuration

All configuration is managed through environment variables and can be customized:

```env
# Server
SERVER_HOST=localhost
SERVER_PORT=25565
SERVER_VERSION=1.20.1

# Bot
BOT_USERNAME=Mineflare
BOT_PASSWORD=
BOT_ONLINE_MODE=false

# Logging
LOG_LEVEL=info
LOG_PRETTY=true

# Dashboard
DASHBOARD_ENABLED=true
DASHBOARD_PORT=3000
DASHBOARD_HOST=0.0.0.0

# API
API_ENABLED=true
API_PORT=3001
API_HOST=0.0.0.0

# Behavior
AUTO_RECONNECT=true
RECONNECT_DELAY=5000
MAX_RECONNECT_ATTEMPTS=10

# Memory
MEMORY_PERSISTENCE=true
MEMORY_PATH=./data/memory

# Plugins
PLUGIN_PATH=./data/plugins
PLUGIN_AUTO_LOAD=true
```

## API Endpoints

The framework provides REST API endpoints:

- `GET /api/status` - Bot status
- `GET /api/inventory` - Inventory contents
- `POST /api/command` - Execute command
- `GET /api/tasks` - Task queue status
- `GET /api/behaviors` - Registered behaviors

## Dashboard

Access the real-time dashboard at `http://localhost:3000`:

- Real-time bot status
- Inventory viewer
- Chat console
- Command executor
- Task monitor
- Behavior controller

## Dependencies

- **mineflayer** - Minecraft bot library
- **mineflayer-pathfinder** - Pathfinding plugin
- **eventemitter3** - Event emitter
- **express** - Web framework
- **socket.io** - Real-time communication
- **pino** - Structured logging
- **dotenv** - Environment variables

## Scripts

```bash
npm start        # Start the bot
npm run dev      # Development mode with auto-reload
npm test         # Run tests
npm run lint     # Run ESLint
npm run lint:fix # Fix linting issues
npm run format   # Format code with Prettier
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Acknowledgments

- Built with [Mineflayer](https://github.com/PrismarineJS/mineflayer)
- Inspired by modern bot frameworks
- Community contributions welcome

---

**Mineflare** - Professional Minecraft Automation, Made Simple
