"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const db_1 = __importDefault(require("../config/db"));
const auth_1 = require("../utils/auth");
const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const existingUser = await db_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const user = await db_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        const token = (0, auth_1.generateToken)(user.id);
        res.status(201).json({ token, userId: user.id, email: user.email });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await db_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await (0, auth_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = (0, auth_1.generateToken)(user.id);
        res.status(200).json({ token, userId: user.id, email: user.email });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.login = login;
