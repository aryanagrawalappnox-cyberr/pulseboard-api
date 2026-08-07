import express from 'express';
import projectRouter from './routes/projects.routes.js';

const app = express();

app.use((req, res, next) => {
    
    const timeStamps = new Date();
    console.log(`[${timeStamps.toISOString()}] ${req.method} ${req.originalUrl}`);
     next();
});

app.get('/health', (req,res) =>{
   res.json({
   status: "ok"
});
});

app.use('/api/v1/projects', projectRouter);


app.use((err,req,res,next) => {
   console.error(err);
   res.status(500).json({
    success: false,
    message: err.message
})
});



export default app;