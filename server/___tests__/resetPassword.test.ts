import express, { Express, Request, Response } from 'express';
import request from 'supertest';
import User from '../models/UserModel';
import { resetPassword } from '../controllers/authController';
import { hashPassword } from '../utils/bcrypt';
import { sendEmail } from '../utils/sendEmail';

jest.mock('../models/UserModel');
jest.mock('../utils/bcrypt', () => ({
    hashPassword: jest.fn(() => 'hashedPassword'),
}));
jest.mock('../utils/sendEmail', () => ({
    sendEmail: jest.fn(() => Promise.resolve()),
}));

describe('resetPassword controller',  () => {
    let app: Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.post('/reset-password', (req, res) => resetPassword(req as Request, res as Response));
    });

    beforeEach(() => {
        jest.clearAllMocks();
        (User.findOne as jest.Mock).mockClear();
    });

    it('should return 404 when the user is not found', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);

        const response = await request(app)
            .post('/reset-password')
            .send({email: 'user@example.com', otp: '123abc', newPassword: 'newPassword'});

        expect(response.statusCode).toBe(404);
        expect(response.text).toBe('User not found');
    });

    it('should return 401 if the OTP does not match', async () => {
        (User.findOne as jest.Mock).mockResolvedValue({
            otp: '123456',
            otpExpire: new Date(Date.now() + 300000),
            save: async () => Promise.resolve(),
        });

        const response = await request(app)
            .post('/reset-password')
            .send({email: 'user@example.com', otp: 'wrongotp', newPassword: 'newPassword'});

        expect(response.statusCode).toBe(401);
        expect(response.text).toBe('Invalid OTP');
    });

    it('should return 401 if the OTP has expired', async () => {
        (User.findOne as jest.Mock).mockResolvedValue({
            otp: '123abc',
            otpExpire: new Date(Date.now() - 300000),
            save: async () => Promise.resolve(),
        });

        const response = await request(app)
            .post('/reset-password')
            .send({email: 'user@example.com', otp: '123abc', newPassword: 'newPassword'});

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('OTP expired');
    });

    it('should return 200 when the password is reset successfully', async () => {
        (User.findOne as jest.Mock).mockResolvedValue({
            email: 'user@example.com',
            otp: '123abc',
            otpExpire: new Date(Date.now() + 300000),
            save: jest.fn().mockResolvedValue({}),
        });

        const response = await request(app)
            .post('/reset-password')
            .send({email: 'user@example.com', otp: '123abc', newPassword: 'newPassword'});

        expect(hashPassword).toHaveBeenCalledWith('newPassword');
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Password reset successful');
        expect(sendEmail).toHaveBeenCalledWith('user@example.com', 'Password reset successful', 'Your password has been reset');
    });

});