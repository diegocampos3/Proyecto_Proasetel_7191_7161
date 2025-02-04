import { Manager } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Set();
  }

  connect = (token) => {
    if (!this.socket) {
      const manager = new Manager('http://localhost:3000/socket.io/socket.io.js', {
        extraHeaders: { authentication: token }
      });

      this.socket = manager.socket('/');

      this.socket.on('connect', () => console.log('Conectado al servidor'));
      this.socket.on('disconnect', () => console.log('Desconectado del servidor'));
      
      this.socket.on('message-form-server', (payload) => {
        this.listeners.forEach(listener => listener(payload));
      });
    }
  };

  disconnect = () => {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  };

  sendMessage = (message) => {
    this.socket?.emit('message-from-client', message);
  };

  addListener = (listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
}

export const webSocketService = new WebSocketService();