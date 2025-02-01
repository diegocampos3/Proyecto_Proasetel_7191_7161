import { io } from "socket.io-client";

// Configura la URL del backend WebSocket (ajústala según tu backend)
const SOCKET_URL = import.meta.env.VITE_APP_SOCKET_URL || "http://localhost:3010";

export const socket = io(SOCKET_URL, {
    transports: ["websocket"],
    withCredentials: true
});
