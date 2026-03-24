import { Request, Response, NextFunction } from "express";
import jwt  from "jsonwebtoken";

declare global {
    namespace Express{
        interface Request{
            user?: { id: number }
        }
    }
}

export const authMiddleware = (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) return res.status(401).json({message: 'Invalid credentials'});

    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET as string) as {id: number};

    req.user = verifiedToken;
    next();
}