import express, { Request, Response } from 'express';
import portfolioRoute from './routes/portfolio'
import tradesRoute from './routes/trades';
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

app.get('/health', (req:Request,res:Response) => {
    res.json({status: 'ok'});
});

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});

export default app;