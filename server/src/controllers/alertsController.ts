import { Request, Response } from 'express';
import { getStockPrice } from '../services/alpaca';
import pool from "../db";

export const getAlerts = async (req: Request, res: Response) => {
    try {
        const userID = req.user?.id;

        const results = await pool.query(`select * from price_alerts where user_id = $1`,[userID]);

        res.json(results.rows);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

export const createAlert = async (req: Request, res: Response) => {
    try {
        const userID = req.user?.id;
        const {ticker, targetPrice, direction} = req.body as {ticker: string, targetPrice: number, direction: number};

        await pool.query(`insert into price_alerts (user_id,ticker,target_price,direction) values ($1,$2,$3,$4)`
            ,[userID,ticker,targetPrice,direction]);

        res.status(200).json({message: 'Success'});

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteAlert = async (req: Request, res: Response) => {
    try {
        const userID = req.user?.id;
        const id = req.params.id;

        await pool.query(`delete from price_alerts where user_id = $1 and id = $2`,[userID,id]);

        res.status(200).json({message: 'Success'});

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}