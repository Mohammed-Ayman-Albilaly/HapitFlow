"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trackingController_1 = require("../controllers/trackingController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/:id/complete', authMiddleware_1.authMiddleware, trackingController_1.completeHabit);
router.get('/:id/history', authMiddleware_1.authMiddleware, trackingController_1.getHabitHistory);
exports.default = router;
