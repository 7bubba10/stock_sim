import { Request, Response, NextFunction } from "express";
import jwt  from "jsonwebtoken";

// Augment Express's Request type so downstream handlers can access req.user
declare global {
    namespace Express{
        interface Request{
            user?: { id: number }
        }
    }
}

export const authMiddleware = (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers.authorization;
    // Expected format: "Bearer <token>"
    const token = authHeader?.split(' ')[1];

    if (!token) return res.status(401).json({message: 'Invalid credentials'});

    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET as string) as {id: number};

    req.user = verifiedToken;
    next();
}