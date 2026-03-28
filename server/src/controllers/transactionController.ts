import { Request, Response } from 'express';
import pool from "../db";

export const getTransaction = async (req: Request, res: Response) => {
    try {
        const userID = req.user?.id;

        const results = await pool.query(`select * from transactions where user_id = $1
            order by created_at desc`, [userID]);

        res.json(results.rows);

    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}