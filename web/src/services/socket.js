import { io } from "socket.io-client";
import { API_BASE_URL } from "./baseQuery.js";

// Socket.IO is served from the same HTTP server as the REST API, at its root
// rather than under /api/v1.
const SOCKET_URL = new URL(API_BASE_URL).origin;

let socket = null;
let socketToken = null;

/**
 * Returns the shared socket for this token, creating it on first use.
 * The server authenticates the handshake with the JWT (src/socket.js), so a
 * new token (another user signing in) needs a new connection.
 */
export function getSocket(token) {
  if (socket && socketToken === token) return socket;

  disconnectSocket();

  socket = io(SOCKET_URL, {
    auth: { token },
    autoConnect: false,
  });
  socketToken = token;

  return socket;
}

export function disconnectSocket() {
  if (!socket) return;

  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
  socketToken = null;
}
