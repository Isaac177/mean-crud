"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const employeeRoutes_1 = __importDefault(require("./routes/employeeRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const mongoDBUrl = process.env.DB_URL;
mongoose_1.default.connect(mongoDBUrl).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Could not connect to MongoDB', err);
});
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
const port = Number(process.env.PORT) || 3000;
app.use('/', employeeRoutes_1.default);
app.use('/', authRoutes_1.default);
app.get('/test', (req, res) => {
    res.send('Hello World!');
});
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});
