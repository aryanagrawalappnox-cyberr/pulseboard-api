import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { setupSocket } from "./socket.js";

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

setupSocket(io);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});