"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/*

if (!process.env.SECRET) {
    throw new Error("JWT Secret not found");
}*/
const verifyAuthToken = (req, res, next) => {
    let token;
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
    console.log('Request token:', token);
    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        if (typeof decoded !== 'object' || !decoded || !('id' in decoded) || !('role' in decoded) || !('username' in decoded)) {
            throw new Error('Token structure mismatch');
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Seems like you have been away for a while. Please log in again.' });
        }
        return res.status(401).json({ error: 'Invalid token' });
    }
};
exports.verifyAuthToken = verifyAuthToken;
