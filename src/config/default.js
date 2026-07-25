/**
 * Default configuration
 */

export default {
  server: {
    host: 'localhost',
    port: 25565,
    version: '1.20.1',
  },
  bot: {
    username: 'Mineflare',
    password: '',
    onlineMode: false,
  },
  behavior: {
    autoReconnect: true,
    reconnectDelay: 5000,
    maxReconnectAttempts: 10,
    autoRespawn: true,
    autoEat: true,
    autoSleep: true,
  },
  performance: {
    pathfindTimeout: 30000,
    pathfindPartial: true,
    maxTaskQueueSize: 100,
  },
};
