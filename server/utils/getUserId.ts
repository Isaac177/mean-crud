import jwt from 'jsonwebtoken';
import express from "express";


export const getUserId = (req: express.Request): { id: string } | null => {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader) {
        token = authHeader.split(' ')[1];
    }

    const cookieToken = req.cookies.token;
    if (cookieToken) {
        token = cookieToken;
    }

    if (!token) {
        return null;
    }

    if (!process.env.SECRET) {
        throw new Error("JWT Secret not found");
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET!) as { id: string };

        if (typeof decoded !== 'object' || !decoded) {
            return null;
        }

        return { id: decoded.id };
    } catch (error: any) {
        return null;
    }
}