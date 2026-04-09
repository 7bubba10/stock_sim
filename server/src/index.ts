import express, { Request, Response } from 'express';
import { startAlertChecker } from './services/alertChecker';
import transactionsRoute from './routes/transactions';
import portfolioRoute from './routes/portfolio'
import performanceRoute from './routes/performance';
import watchlistRoute from './routes/watchlist';
import backTestRoute from './routes/backtest';
import tradesRoute from './routes/trades';
import marketRoute from './routes/market';
import alertRoute from './routes/alerts';
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

app.use('/api/backtest', backTestRoute);

app.use('/api/watchlist', watchlistRoute);

app.use('/api/alerts', alertRoute);

app.get('/health', (req:Request,res:Response) => {
    res.json({status: 'ok'});
});

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
    // Start polling for price alerts as soon as the server is ready
    startAlertChecker();
});

export default app;