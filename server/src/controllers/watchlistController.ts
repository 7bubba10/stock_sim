import { Request, Response } from 'express';
import { getStockPrice } from '../services/alpaca';
import pool from "../db";

export const getWatchlist = async (req: Request, res: Response) => {
    try {
        const userID = req.user?.id;

        const results = await pool.query(`select ticker from watchlists where user_id = $1`,[userID]);

        const prices = await Promise.all(
            results.rows.map(row => getStockPrice(row.ticker))
        );

        const watchList = results.rows.map((row,index) => ({
            ticker: row.ticker,
            price: prices[index]
        }));

        res.json(watchList);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

export const addToWatchlist = async (req: Request, res: Response) => {
    try {
        const { ticker } = req.body as { ticker: string };
        const userID = req.user?.id;

        await pool.query(`insert into watchlists (user_id, ticker) values ($1,$2)`, [userID, ticker]);

        res.status(200).json({message: 'Success'});

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

export const removeFromWatchlist = async (req: Request, res: Response) => {
    try {
        const ticker = req.params.ticker;
        const userID = req.user?.id;

        await pool.query(`delete from watchlists where ticker = $1 and user_id = $2`,[ticker,userID]);

        res.status(200).json({message: 'Success'});


    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}