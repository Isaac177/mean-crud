import express from "express";
import {verifyAuthToken} from "../middleware/verifyToken";
import {createUser, getUserById, getUsers, loginUser, logoutUser} from "../controllers/authController";


const router = express.Router();

router.post('/login', loginUser);

router.post('/register', createUser);

router.get('/users', verifyAuthToken, getUsers);

router.get('/users/:userId', verifyAuthToken, getUserById);

router.post('/logout', logoutUser);


export default router;