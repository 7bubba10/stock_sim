import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import pool from "../db";
import jwt from "jsonwebtoken";


export const register = async (req: Request, res: Response) => {
    
    try {  
        const { email, username, password } = req.body as { email: string, username: string, password: string };
        // 10 salt rounds is bcrypt's recommended default for a good speed/security balance
        const password_hash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'insert into users (email, username, password_hash) VALUES ($1, $2, $3) returning id',
            [email, username, password_hash]
        );

        const userID = result.rows[0].id;
        // Note: login signs as { id }, but register signs as { userID } — authMiddleware reads { id }
        const token = jwt.sign({userID},process.env.JWT_SECRET as string, {expiresIn: '1h'});

        res.status(201).json({ token });
        
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const login = async(req: Request, res: Response) =>{
    try{
        const { email, password } = req.body as { email: string, password: string };

        const result = await pool.query(
            'select * from users where email = ($1)',
            [email]
        );

        // If response doe not exist
        if (result.rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const user = result.rows[0];

        const comparePass = await bcrypt.compare(password,user.password_hash);

        if (!comparePass){
            res.status(401).json({ message: 'Invalid credentials' });
        } else {
            const token = jwt.sign({id: user.id}, process.env.JWT_SECRET as string, {expiresIn: '1h'});
            res.status(200).json({token, userID: result.rows[0].id});
        }


    }
    catch (error){
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}