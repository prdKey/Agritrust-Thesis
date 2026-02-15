import { Server } from "socket.io";
import registerSocketHandlers from "../sockets/index.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // This line calls your registerSocketHandlers
    registerSocketHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export const getIO = () => io;
