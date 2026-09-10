import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import jwt from "jsonwebtoken";
import prisma from "./prisma.js";

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
        return next(new Error("Authentication required"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new Error("Invalid or expired token"));
        }

        socket.user = {
            id: decoded.userId
        };

        next();
    });
});

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinProject", async (projectId) => {
    const numericProjectId = Number(projectId);

    if (
        !Number.isInteger(numericProjectId) ||
        numericProjectId <= 0
    ) {
        socket.emit("projectError", "Invalid project ID");
        return;
    }

    const membership = await prisma.project_members.findUnique({
        where: {
            user_id_project_id: {
                user_id: socket.user.id,
                project_id: numericProjectId
            }
        }
    });

    if (!membership) {
        socket.emit(
            "projectError",
            "You do not have access to this project"
        );
        return;
    }

    const room = `project:${numericProjectId}`;

    socket.join(room);

    console.log(
        `User ${socket.user.id} joined ${room}`
    );
});

    socket.on("leaveProject", (projectId) => {
        const room = `project:${projectId}`;

        socket.leave(room);

        console.log(
            `Socket ${socket.id} left ${room}`
        );
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
