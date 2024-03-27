import express, { Express, Request, Response } from 'express';
import request from 'supertest';
import User from '../models/UserModel';
import { verifyOtp } from '../controllers/authController';

jest.mock('../models/UserModel');

describe('verifyOtp controller', () => {
    let app: Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.post('/verify-otp', (req, res) => verifyOtp(req as Request, res as Response));
    });

    beforeEach(() => {
        jest.clearAllMocks();
        (User.findOne as jest.Mock).mockClear();
    });

    it('should return 404 when the user is not found', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);

        const response = await request(app).post('/verify-otp').send({email: 'user@example.com', otp: '123abc'});

        expect(response.statusCode).toBe(404);
        expect(response.text).toBe('User not found');
    });

    it('should return 401 if the OTP does not match', async () => {
        (User.findOne as jest.Mock).mockResolvedValue({otp: '123456', otpExpire: new Date(Date.now() + 300000)});

        const response = await request(app).post('/verify-otp').send({email: 'user@example.com', otp: 'wrongotp'});

        expect(response.statusCode).toBe(401);
        expect(response.text).toBe('Invalid OTP');
    });

    it('should return 401 if the OTP has expired', async () => {
        (User.findOne as jest.Mock).mockResolvedValue({otp: '123abc', otpExpire: new Date(Date.now() - 300000)});

        const response = await request(app).post('/verify-otp').send({email: 'user@example.com', otp: '123abc'});

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('OTP expired');
    });

    it('should return 200 when the OTP is verified successfully', async () => {
        (User.findOne as jest.Mock).mockResolvedValue({otp: '123abc', otpExpire: new Date(Date.now() + 300000)});

        const response = await request(app).post('/verify-otp').send({email: 'user@example.com', otp: '123abc'});

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('OTP verified');
    });

    it('should return 500 if there is a server error', async () => {
        const mockError = new Error('Internal server error');
        (User.findOne as jest.Mock).mockRejectedValue(mockError);

        const response = await request(app).post('/verify-otp').send({email: 'user@example.com', otp: '123abc'});

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Internal Server Error');
        expect(response.body.error).toBe(mockError.message);

    });
})

