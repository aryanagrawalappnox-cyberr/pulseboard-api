import express from 'express';

const app = express();

app.use((req, res, next) => {
    
    const timeStamps = new Date();
    console.log(`[${timeStamps.toISOString()}] ${req.method} ${req.originalUrl}`);
    // next();
});

export default app;
