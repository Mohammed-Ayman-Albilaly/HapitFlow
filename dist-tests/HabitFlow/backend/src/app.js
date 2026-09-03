"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const habitRoutes_1 = __importDefault(require("./routes/habitRoutes"));
const trackingRoutes_1 = __importDefault(require("./routes/trackingRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/auth', authRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/habits', habitRoutes_1.default);
app.use('/api/tracking', trackingRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
exports.default = app;
