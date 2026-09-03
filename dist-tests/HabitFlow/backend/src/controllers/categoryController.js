"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = exports.getCategories = void 0;
const db_1 = __importDefault(require("../config/db"));
const getCategories = async (req, res) => {
    try {
        const userId = req.user.userId;
        const categories = await db_1.default.category.findMany({
            where: { userId },
            orderBy: { name: 'asc' },
        });
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getCategories = getCategories;
const createCategory = async (req, res) => {
    try {
        const { name, color } = req.body;
        const userId = req.user.userId;
        if (!name || !color) {
            return res.status(400).json({ message: 'Name and color are required' });
        }
        const category = await db_1.default.category.create({
            data: {
                name,
                color,
                userId,
            },
        });
        res.status(201).json(category);
    }
    catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'Category name already exists' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createCategory = createCategory;
