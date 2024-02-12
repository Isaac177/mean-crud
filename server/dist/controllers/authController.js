"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getUsers = exports.logoutUser = exports.loginUser = exports.createUser = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const jwt_1 = require("../middleware/jwt");
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = require("../utils/bcrypt");
const createUser = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        const validation = joi_1.default.object({
            username: joi_1.default.string().alphanum().min(3).max(30).required(),
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().min(6).required(),
            confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).required()
        }).validate({ username, email, password, confirmPassword });
        if (validation.error) {
            res.status(400).send(validation.error.details[0].message);
            return;
        }
        if (await UserModel_1.default.findOne({ email })) {
            res.status(400).send('User already exists');
            return;
        }
        const user = new UserModel_1.default({
            username,
            email,
            password: await (0, bcrypt_1.hashPassword)(password)
        });
        await user.save();
        const tokenPayload = {
            id: user._id,
            username: user.username,
            role: user.role
        };
        const token = (0, jwt_1.signToken)(tokenPayload);
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(201).json({
            message: 'User created successfully',
            user,
            token
        });
    }
    catch (error) {
        console.error('Failed to create user:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};
exports.createUser = createUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validation = joi_1.default.object({
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().required()
        }).validate({ email, password });
        if (validation.error) {
            res.status(400).send(validation.error.details[0].message);
            return;
        }
        const user = await UserModel_1.default.findOne({ email });
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        const passwordMatch = await (0, bcrypt_1.comparePassword)(password, user.password);
        if (!passwordMatch) {
            res.status(401).send('Invalid password');
            return;
        }
        const tokenPayload = {
            id: user._id,
            username: user.username,
            role: user.role
        };
        const token = (0, jwt_1.signToken)(tokenPayload);
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            message: 'Login successful',
            user,
            token
        });
    }
    catch (error) {
        console.error('Failed to login user:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};
exports.loginUser = loginUser;
const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Logout successful' });
    }
    catch (error) {
        console.error('Failed to logout user:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};
exports.logoutUser = logoutUser;
const getUsers = async (req, res) => {
    try {
        const users = await UserModel_1.default.find();
        res.status(200).json({ users });
    }
    catch (error) {
        console.error('Failed to retrieve users:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await UserModel_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: `User with id ${userId} not found` });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Failed to retrieve user:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};
exports.getUserById = getUserById;
