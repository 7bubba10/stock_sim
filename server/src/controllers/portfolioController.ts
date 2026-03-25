import { Request, Response } from 'express';
import { getStockPrice } from '../services/alpaca';
import pool from "../db";


export const getPortfolio = async (req: Request, res: Response) => {
    try {
        const userID = req.user?.id;

        const results = await pool.query(`select * from positions where user_id = $1`, [userID]);

        const positionsWithPrices = await Promise.all(
            results.rows.map(position => getStockPrice(position.ticker))
        );

        const portfolio = results.rows.map((position, index) => {
            const currentPrice = positionsWithPrices[index];

            const currentValue = currentPrice * position.shares;
            const gainLoss = currentValue - (position.avg_cost * position.shares);
            const gainLossPercent = (gainLoss / (position.avg_cost * position.shares)) * 100;

            return {
                ticker: position.ticker,
                shares: position.shares,
                avgCost: position.avg_cost,
                currentPrice: currentPrice,
                currentValue: currentValue,
                gainLoss: gainLoss,
                gainLossPercent: gainLossPercent
            };

        });

        const userResult = await pool.query('select cash_balance from users where id = $1', [userID]);
        const cashBalance = userResult.rows[0].cash_balance;
        res.json({ portfolio: portfolio, cashBalance: cashBalance });
        
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        res.status(500).json({ message: 'Internal server error' });
    }





}