import express, { Express, Request, Response } from 'express';
import request from 'supertest';
import User from '../models/UserModel';
import * as bcryptUtils from '../utils/bcrypt';
import { loginUser } from '../controllers/authController';


jest.mock('../models/UserModel');
jest.mock('../utils/bcrypt');


describe('loginUser controller', () => {
    let app: Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.post('/login', (req, res) => loginUser(req as Request, res as Response));
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should login a user and return 200 status', async () => {
        const mockUser = {
            _id: '123',
            username: 'testUser',
            email: 'test@example.com',
            password: 'hashedPassword',
        };
        User.findOne = jest.fn().mockResolvedValue(mockUser);
        (bcryptUtils.comparePassword as jest.Mock).mockResolvedValue(true);

        const response = await request(app)
            .post('/login')
            .send({
                email: 'test@example.com',
                password: 'password123',
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Login successful');
    });

    it('should return 404 if the user does not exist', async () => {
        User.findOne = jest.fn().mockResolvedValue(null);

        const response = await request(app)
            .post('/login')
            .send({
                email: 'test@example.com',
                password: 'password123',
            });

        expect(response.statusCode).toBe(404);
        expect(response.text).toBe('User not found');
    });

    it('should return 401 if the password is incorrect', async () => {
        const mockUser = {
            _id: '123',
            username: 'testUser',
            email: 'test@example.com',
            password: 'hashedPassword',
        };
        User.findOne = jest.fn().mockResolvedValue(mockUser);
        (bcryptUtils.comparePassword as jest.Mock).mockResolvedValue(false);

        const response = await request(app)
            .post('/login')
            .send({
                email: 'test@example.com',
                password: 'wrongPassword',
            });

        expect(response.statusCode).toBe(401);
        expect(response.text).toBe('Invalid password');
    });
});