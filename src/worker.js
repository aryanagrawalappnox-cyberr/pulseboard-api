import { Worker } from "bullmq";

const connection = {
    host: "127.0.0.1",
    port: 6379
};

const worker = new Worker(
    "uploadQueue",
    async (job) => {
        console.log("Processing upload job:", job.id);
        console.log("Job data:", job.data);

        // File processing will be added here later.

        return {
            success: true
        };
    },
    { connection }
);

worker.on("completed", (job) => {
    console.log(`Upload job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
    console.error(
        `Upload job ${job?.id} failed:`,
        error.message
    );
});

console.log("Upload worker started");