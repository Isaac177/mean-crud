import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.SECRET) {
    throw new Error("JWT Secret not found");
}

export const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader) {
        token = authHeader.split(' ')[1];
    }

    if (!token) {
        const cookieToken = req.cookies.token;
        if (cookieToken) {
            token = cookieToken;
        }
    }

    console.log('Request token:', token)

    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET!) as unknown;

        if (typeof decoded !== 'object' || !decoded || !('id' in decoded) || !('role' in decoded) || !('username' in decoded)) {
            throw new Error('Token structure mismatch');
        }

        (req as any).user = decoded as { id: number, role: string };

        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Seems like you have been away for a while. Please log in again.' });
        }
        return res.status(401).json({ error: 'Invalid token' });
    }
};