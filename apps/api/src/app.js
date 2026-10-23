import express from 'express';
import cors from 'cors';
import { responseHandler, errorHandler } from './middleware/index.js';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';
// import { auditMiddleware } from './middleware/auditLog.middleware.js';

const app = express();

app.use(
  cors({
    origin: 'https://inventory.axentralabs.in',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

app.use(responseHandler);

// app.use(auditMiddleware);
app.use('/api', router);
app.get('/health', (req, res) => {
  res.json({ status: 'health is ok' });
});

app.use(errorHandler);

export default app;
