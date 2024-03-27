import express, { Express, Request, Response } from 'express';
import request from 'supertest';
import User from '../models/UserModel';
import * as getUserIdModule from "../utils/getUserId";
import {getUsers} from "../controllers/authController";

jest.mock('../models/UserModel');
jest.mock('../utils/getUserId');

describe('getUsers controller', () => {
    let app: Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.get('/users', (req, res) => getUsers(req as Request, res as Response));
    });

    beforeEach(() => {
        jest.clearAllMocks();
        (User.find as jest.Mock).mockClear();
        (getUserIdModule.getUserId as jest.Mock).mockClear();
    });

    it('should return 500 if there is an internal server error', async () => {
        const mockError = new Error('Internal server error');
        (User.find as jest.Mock).mockRejectedValue(mockError);
        (getUserIdModule.getUserId as jest.Mock).mockReturnValue({ id: '123' });

        const response = await request(app).get('/users');

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Internal Server Error');
        expect(response.body.error).toBe(mockError.message);
    });

    it('should return 401 if the user is not authorized', async () => {
        (getUserIdModule.getUserId as jest.Mock).mockReturnValue(null);

        const response = await request(app).get('/users');

        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe('Unauthorized');
    });
});
