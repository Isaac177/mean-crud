import { Request, Response } from 'express';
import User from '../models/UserModel';
import {Payload, signToken} from "../middleware/jwt";
import Joi from "joi";
import {comparePassword, hashPassword} from "../utils/bcrypt";
import {getUserId} from "../utils/getUserId";
import {sendEmail} from "../utils/sendEmail";
import crypto from 'crypto';



export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        const validation = Joi.object({
            username: Joi.string().alphanum().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            confirmPassword: Joi.string().valid(Joi.ref('password')).required()
        }).validate({ username, email, password, confirmPassword });

        if (validation.error) {
            res.status(400).send(validation.error.details[0].message);
            return;
        }

        if (await User.findOne({ email })) {
            res.status(400).send('User already exists');
            return;
        }

        const user = new User({
            username,
            email,
            password: await hashPassword(password)
        });

        await user.save();

        const tokenPayload: Payload = {
            id: user._id,
            username: user.username,
            role: user.role
        };

        const token = signToken(tokenPayload);

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: 'User created successfully',
            user,
            token
        });

        await sendEmail(email, 'Welcome to the app!', 'You have successfully created an account')

    } catch (error: any) {
        console.error('Failed to create user:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }

}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        const validation = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }).validate({email, password});

        if (validation.error) {
            res.status(400).send(validation.error.details[0].message);
            return;
        }

        const user = await User.findOne({email});

        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        const passwordMatch = await comparePassword(password, user.password);

        if (!passwordMatch) {
            res.status(401).send('Invalid password');
            return;
        }

        const tokenPayload: Payload = {
            id: user._id,
            username: user.username,
            role: user.role
        };

        const token = signToken(tokenPayload);

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: 'Login successful',
            user,
            token
        });
    } catch (error: any) {
        console.error('Failed to login user:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

export const logoutUser = async (req: Request, res: Response) => {
    try {
        res.clearCookie('token');
        res.status(200).json({message: 'Logout successful'});
    } catch (error: any) {
        console.error('Failed to logout user:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const tokenPayload = getUserId(req);

        if (!tokenPayload) {
            res.status(401).json({error: 'Unauthorized'});
            return;
        }

        const users = await User.find();
        res.status(200).json({users});
    } catch (error: any) {
        console.error('Failed to retrieve users:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({message: `User with id ${userId} not found`});
            return;
        }

        res.status(200).json(user);
    } catch (error: any) {
        console.error('Failed to retrieve user:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

export const sendOtp = async (req: Request, res: Response) => {
    if (!res || typeof res.send !== 'function' || typeof res.status !== 'function') {
        console.error('Invalid response object');
        return;
    }

    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        const otp = crypto.randomBytes(3).toString('hex');
        const otpExpire = new Date(Date.now() + 20*60*1000);

        user.otp = otp;
        user.otpExpire = otpExpire;

        await user.save();

        await sendEmail(email, 'OTP for password reset', `Your OTP is ${otp}`);

        res.status(200).send({
            message: 'OTP sent to email'
        });
    } catch (error: any) {
        console.error('Failed to send OTP:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
            stack: error.stack
        });
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { otp, email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        if (otp !== user.otp) {
            res.status(401).send('Invalid OTP');
            return;
        }

        if (new Date() > user.otpExpire) {
            res.status(401).send({
                message: 'OTP expired'
            });
            return;
        }

        res.status(200).send({
            message: 'OTP verified'
        });
    } catch (error: any) {
        console.error('Failed to verify OTP:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        if (otp !== user.otp) {
            res.status(401).send('Invalid OTP');
            return;
        }

        if (new Date() > user.otpExpire) {
            res.status(401).send({
                message: 'OTP expired'
            });
            return;
        }

        user.password = await hashPassword(newPassword);
        user.otp = '';
        user.otpExpire = new Date();

        await user.save();

        await sendEmail(email, 'Password reset successful', 'Your password has been reset')

        res.status(200).send({
            message: 'Password reset successful'
        });
    } catch (error: any) {
        console.error('Failed to reset password:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

