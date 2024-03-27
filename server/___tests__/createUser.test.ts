import request from 'supertest';
import express, {Request, Response, Express} from "express";
import User from '../models/UserModel';
import * as bcryptUtils from '../utils/bcrypt';
import * as emailUtils from '../utils/sendEmail';
import {createUser} from "../controllers/authController";

jest.mock('../models/UserModel');
jest.mock('../utils/bcrypt');
jest.mock('../utils/sendEmail');

describe('createUser controller', () => {
    let app: Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.post('/users', (req, res) => createUser(req as Request, res as Response));
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new user and return 201 status', async () => {
        const mockUserSave = jest.fn();
        User.findOne = jest.fn().mockResolvedValue(null);
        (emailUtils.sendEmail as jest.Mock).mockResolvedValue(true);
        (bcryptUtils.hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
        User.prototype.save = mockUserSave.mockResolvedValue({
            _id: '123',
            username: 'testUser',
            email: 'test@example.com',
            password: 'hashedPassword',
        });

        const response = await request(app)
            .post('/users')
            .send({
                username: 'testUser',
                email: 'test@example.com',
                password: 'password123',
                confirmPassword: 'password123',
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('User created successfully');
        expect(emailUtils.sendEmail).toHaveBeenCalledWith('test@example.com', 'Welcome to the app!', 'You have successfully created an account');
    });

    it('should return 400 if the user already exists', async () => {
        User.findOne = jest.fn().mockResolvedValue({
            email: 'test@example.com',
        });

        const response = await request(app)
            .post('/users')
            .send({
                username: 'testUser',
                email: 'test@example.com',
                password: 'password123',
                confirmPassword: 'password123',
            });

        expect(response.statusCode).toBe(400);
        expect(response.text).toBe('User already exists');
    });
});
