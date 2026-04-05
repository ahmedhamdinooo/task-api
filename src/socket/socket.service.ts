import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";

let io: SocketServer;

export const initSocket = (httpServer: HttpServer) => {
  io = new SocketServer(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);
    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const emitTaskUpdated = (task: unknown) => {
  io?.emit("task.updated", task);
};

export const emitCommentCreated = (comment: unknown) => {
  io?.emit("comment.created", comment);
};