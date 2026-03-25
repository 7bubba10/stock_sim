import { Request, Response } from 'express';
import { getStockPrice } from '../services/alpaca';
import pool from "../db";

export const executeBuy = async (req: Request, res: Response) => {
    try {
        const { ticker, shares } = req.body as { ticker: string, shares: number };

        const price = await getStockPrice(ticker);

        const totalCost = (price * shares);

        const userID = req.user?.id;

        const result = await pool.query('select cash_balance from users where id = $1', [userID]);

        if (result.rows[0].cash_balance < totalCost) {
            return res.status(400).json({ message: 'Not enough cash' });
        } else {
            await pool.query('update users set cash_balance = cash_balance - $1 where id = $2', [totalCost, userID]);
        }

        // Update Transaction table with new transaction
        const transactionUpdate = await pool.query('insert into transactions (user_id, ticker, type, shares, price, total) values ($1, $2, $3, $4, $5, $6)'
            , [userID, ticker, 'buy', shares, price, totalCost]);

        // Update positions table with new position
        const new_avg_cost = await pool.query(`insert into positions (user_id, ticker, shares, avg_cost) 
        values ($1,$2,$3,$4) on conflict (user_id, ticker) 
        do update set 
        shares = positions.shares + excluded.shares, 
        avg_cost = 
        (positions.shares * positions.avg_cost + excluded.shares * excluded.avg_cost) / (positions.shares + excluded.shares)`,
            [userID, ticker, shares, price]);
        
        res.status(200).json({message: 'Success'});

    } catch (error){
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
    
    


}