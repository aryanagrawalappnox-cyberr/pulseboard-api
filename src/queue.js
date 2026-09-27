import { Queue } from "bullmq";

// Shared by the queue, src/worker.js and src/uploadEvents.js.
export const connection = {
    host: "127.0.0.1",
    port: 6379
};

export const UPLOAD_QUEUE_NAME = "uploadQueue";

export const uploadQueue = new Queue(UPLOAD_QUEUE_NAME, {
    connection
});
