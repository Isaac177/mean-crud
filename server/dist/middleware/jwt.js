"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/*if (!process.env.SECRET) {
    throw new Error("JWT Secret not found");
}*/
const SECRET = process.env.SECRET;
const signToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, SECRET, { expiresIn: '24h' });
};
exports.signToken = signToken;
