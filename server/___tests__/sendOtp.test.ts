import express, { Express, Request, Response } from 'express';
import request from 'supertest';
import User from '../models/UserModel';
import * as crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail';
import {sendOtp} from "../controllers/authController";

jest.mock('../models/UserModel');
jest.mock('crypto');
jest.mock('../utils/sendEmail');

describe('sendOtp controller', () => {
    let app: Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.post('/send-otp', (req, res) => sendOtp(req as Request, res as Response));
    });

    beforeEach(() => {
        jest.clearAllMocks();
        (User.findOne as jest.Mock).mockClear();
        (crypto.randomBytes as jest.Mock).mockClear();
        (sendEmail as jest.Mock).mockClear();
    });

    it('should return 404 when the user is not found', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);

        const response = await request(app).post('/send-otp').send({ email: 'user@example.com' });

        expect(response.statusCode).toBe(404);
        expect(response.text).toBe('User not found');
    });

    it('should return 200 and send an OTP when the user is found', async () => {
        (User.findOne as jest.Mock).mockResolvedValue({ email: 'user@example.com', save: jest.fn() });
        (crypto.randomBytes as jest.Mock).mockReturnValue({ toString: () => '123abc' });
        (sendEmail as jest.Mock).mockResolvedValue(undefined); // Mocking sendEmail as a resolved promise

        const response = await request(app).post('/send-otp').send({ email: 'user@example.com' });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('OTP sent to email');
        expect(sendEmail).toHaveBeenCalled();
    });

    it('should return 500 if there is a server error', async () => {
        const mockError = new Error('Internal server error');
        (User.findOne as jest.Mock).mockRejectedValue(mockError);

        const response = await request(app).post('/send-otp').send({ email: 'user@example.com' });

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Internal Server Error');
        expect(response.body.error).toBe(mockError.message);
    });
});
