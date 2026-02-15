import orderSocket from "./order.socket.js";
import trackingSocket from "./tracking.socket.js";

export default function registerSocketHandlers(io, socket) {
  orderSocket(io, socket);
  trackingSocket(io, socket);
}
