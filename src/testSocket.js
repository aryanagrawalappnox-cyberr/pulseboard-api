import { io } from "socket.io-client";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJpYXQiOjE3OTA1NDU3NzksImV4cCI6MTc5MDU0OTM3OX0.jNyijvI_CxTrL24fA_EnRHshF3SQY_7V89TJp1OUM1c";

const socket = io("http://localhost:3000", {
    auth: {
        token
    }
});

socket.on("connect", () => {
    console.log("Connected:", socket.id);

    socket.emit("joinProject", 21);

    
});

socket.on("commentCreated", (comment) => {
    console.log("Comment created:", comment);
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