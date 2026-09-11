import { io } from "socket.io-client";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJpYXQiOjE3ODkwNzE5OTUsImV4cCI6MTc4OTA3NTU5NX0.Y3WH2fl9wWzipH5XrA_EVcObqiQ9fe8eqMyDG7HU1iQ";

const socket = io("http://localhost:3000", {
    auth: {
        token
    }
});

socket.on("connect", () => {
    console.log("Connected:", socket.id);

    socket.emit("joinProject", 21);

    setTimeout(() => {
        socket.disconnect();
    }, 1000);
});

socket.on("projectError", (message) => {
    console.log("Project error:", message);
});

socket.on("connect_error", (error) => {
    console.log("Connection error:", error.message);
});