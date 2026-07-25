/**
 * Real-time dashboard server using Socket.IO
 */

import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { Logger } from '../core/Logger.js';

const logger = new Logger('DashboardServer');

/**
 * Real-time dashboard server
 */
export class DashboardServer {
  /**
   * Create dashboard server
   * @param {Object} config
   */
  constructor(config) {
    this.config = config;
    this.logger = logger.createChild('Server');
    this.httpServer = null;
    this.io = null;
    this.clients = new Map();
  }

  /**
   * Start dashboard server
   * @param {BotManager} manager
   */
  async start(manager) {
    try {
      this.httpServer = createServer();
      this.io = new SocketIOServer(this.httpServer, {
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
        },
      });

      this._setupSocketHandlers(manager);

      this.httpServer.listen(this.config.dashboard.port, this.config.dashboard.host, () => {
        this.logger.info(
          `Dashboard started on ${this.config.dashboard.host}:${this.config.dashboard.port}`
        );
      });
    } catch (error) {
      this.logger.error('Failed to start dashboard:', error);
      throw error;
    }
  }

  /**
   * Setup socket handlers
   * @private
   */
  _setupSocketHandlers(manager) {
    this.io.on('connection', (socket) => {
      this.logger.info(`Client connected: ${socket.id}`);
      this.clients.set(socket.id, socket);

      // Send initial state
      socket.emit('state', {
        status: manager.getStatus(),
      });

      // Handle commands
      socket.on('command', (data) => {
        this.logger.debug(`Command from ${socket.id}:`, data);
      });

      socket.on('disconnect', () => {
        this.clients.delete(socket.id);
        this.logger.info(`Client disconnected: ${socket.id}`);
      });
    });
  }

  /**
   * Broadcast state update
   * @param {string} event
   * @param {Object} data
   */
  broadcast(event, data) {
    this.io?.emit(event, data);
  }

  /**
   * Stop dashboard server
   */
  async stop() {
    return new Promise((resolve, reject) => {
      if (this.httpServer) {
        this.httpServer.close((error) => {
          if (error) reject(error);
          else {
            this.logger.info('Dashboard stopped');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}
