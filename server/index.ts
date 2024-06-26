import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import employeeRoutes from "./routes/employeeRoutes";
import authRoutes from "./routes/authRoutes";
import salesRoutes from "./routes/salesRoutes";
import http from 'http';
import { Server } from 'socket.io';
import rateLimit from "express-rate-limit";
import { graphqlHTTP } from 'express-graphql';
import schema from './schema';


dotenv.config();

const app = express();

const corsOptions = {
    origin: 'http://localhost:4200',
    credentials: true,
};

app.use(cors(corsOptions));

const server = http.createServer(app);

const io = new Server(server, {
    cors: corsOptions
});

const mongoDBUrl = process.env.DB_URL;

mongoose.connect(mongoDBUrl as string).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Could not connect to MongoDB', err);
});

app.use(express.json());

app.use(cors());

app.use(cookieParser());

const port = Number(process.env.PORT) || 3000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50
});

app.use('/', limiter, employeeRoutes);
app.use('/', limiter, authRoutes);
app.use('/', limiter, salesRoutes);

app.get('/test', (req, res) => {
    res.send('Hello World!');
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));
io.on('connection', (socket) => {
    console.log('a user connected with socket id:', socket.id);

    socket.on('message', (msg) => {
        console.log('message: ' + msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected with socket id:', socket.id);
    });
});

server.listen(port, '0.0.0.0', () => {
    console.log(`HTTP and WebSocket server is running on port ${port}`);
});

