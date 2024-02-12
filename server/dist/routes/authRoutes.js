"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../middleware/verifyToken");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.post('/login', authController_1.loginUser);
router.post('/register', authController_1.createUser);
router.get('/users', verifyToken_1.verifyAuthToken, authController_1.getUsers);
router.get('/users/:userId', verifyToken_1.verifyAuthToken, authController_1.getUserById);
exports.default = router;
