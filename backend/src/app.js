import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import examRoutes from './routes/examRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cryptoRoutes from './routes/cryptoRoutes.js';
import hybridRoutes from './routes/hybridRoutes.js';
import signatureRoutes from './routes/signatureRoutes.js';
import errorHandler from './middleware/errorMiddleware.js';

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/crypto', cryptoRoutes);
app.use('/api/hybrid', hybridRoutes);
app.use('/api/signature', signatureRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
    res.json({ message: 'SecureExamVault Auth Service API is running' });
});

export default app;