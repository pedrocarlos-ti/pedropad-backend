import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";

dotenv.config();

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const io: Server = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

const PORT: number = 3000;

let currentContent: string = "";

// Socket.IO connection
io.on("connection", (socket: Socket) => {
  console.log("A user connected");

  // Send the current content to the newly connected user
  socket.emit("initial_content", currentContent);

  // Listen for content sent from clients
  socket.on("send_content", (content: string) => {
    // Update the stored content
    currentContent = content;
    // Broadcast the content to all clients, including the sender
    io.emit("receive_content", content);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
