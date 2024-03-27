import express, { Express, Request, Response } from 'express';
import request from 'supertest';
import { logoutUser } from '../controllers/authController';


describe('logoutUser controller', () => {
    let app: Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.post('/logout', (req, res) => logoutUser(req as Request, res as Response));
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should logout a user and return 200 status', async () => {
        const response = await request(app).post('/logout');

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Logout successful');
    });
});

