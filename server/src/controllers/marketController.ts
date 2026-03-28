import { Request, Response } from 'express';
import { getStockPrice } from '../services/alpaca';

export const getPrice = async (req: Request, res: Response,) => {
    try {
        const ticker = req.query.ticker as string;
        const price = await getStockPrice(ticker);

        res.json(price);

    } catch (error) {
        console.error('Error fetching price:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}