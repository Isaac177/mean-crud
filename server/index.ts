import express from 'express';
import mongoose from 'mongoose';
import employeeRoutes from "./employeeRoutes";
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();
const app = express();

const mongoDBUrl = process.env.DB_URL;

mongoose.connect(mongoDBUrl as string).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Could not connect to MongoDB', err);
});

app.use(express.json());

app.use(cors());

const port = Number(process.env.PORT) || 3000;

app.use('/', employeeRoutes);

app.get('/test', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});
