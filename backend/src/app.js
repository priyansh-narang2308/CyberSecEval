import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middleware/errorMiddleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
    res.json({ message: 'SecureExamVault Auth Service API is running' });
});

export default app;
