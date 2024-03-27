import express from "express";
import {verifyAuthToken} from "../middleware/verifyToken";
import {
    createUser,
    getUserById,
    getUsers,
    loginUser,
    logoutUser,
    resetPassword,
    sendOtp,
    verifyOtp
} from "../controllers/authController";

const router = express.Router();

router.post('/login', loginUser);

router.post('/register', createUser);

router.get('/users', verifyAuthToken, getUsers);

router.get('/users/:userId', verifyAuthToken, getUserById);

router.post('/logout', logoutUser);

router.post('/sendOtp', sendOtp);
router.post('/verifyOtp', verifyOtp);
router.post('/auth/reset-password', resetPassword);

export default router;