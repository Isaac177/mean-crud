import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

if (!process.env.SECRET) {
    throw new Error("JWT Secret not found");
}

const SECRET=process.env.SECRET!;

export interface Payload {
    id: string,
    role: string,
    username: string,
}

export const signToken = (payload: Payload): string => {
    return jwt.sign(payload, SECRET, {expiresIn: '24h'});
}