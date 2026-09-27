import { io } from "socket.io-client";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJpYXQiOjE3OTA1MzA4MjEsImV4cCI6MTc5MDUzNDQyMX0.jJzd5xL6CN7GluulyWNOrF3pDzv-4ZKePPApibzH8QU";

const socket = io("http://localhost:3000", {
    auth: {
        token
    }
});

socket.on("connect", () => {
    console.log("Connected:", socket.id);

    socket.emit("joinProject", 21);

    
});

socket.on("taskCreated", (task) => {
    console.log("Task created:", task);
});

socket.on("taskUpdated", (task) => {
    console.log("Task updated:", task);
});

socket.on("taskDeleted", (task) => {
    console.log("Task deleted:", task);
});

socket.on("projectError", (message) => {
    console.log("Project error:", message);
});

socket.on("connect_error", (error) => {
    console.log("Connection error:", error.message);
});