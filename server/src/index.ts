import express, { Request, Response } from 'express';
import transactionsRoute from './routes/transactions';
import portfolioRoute from './routes/portfolio'
import performanceRoute from './routes/performance';
import tradesRoute from './routes/trades';
import marketRoute from './routes/market';
import authRoutes from './routes/auth';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/portfolio', portfolioRoute);

app.use('/api/auth', authRoutes);

app.use('/api/trades', tradesRoute);

app.use('/api/market', marketRoute);

app.use('/api/transactions', transactionsRoute);

app.use('/api/performance', performanceRoute);

app.get('/health', (req:Request,res:Response) => {
    res.json({status: 'ok'});
});

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});

export default app;