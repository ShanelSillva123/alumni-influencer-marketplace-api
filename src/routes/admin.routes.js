// src/routes/admin.routes.js

const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const dailyWinnerJob = require("../jobs/dailyWinner.job");

router.get(
    "/users",
    authMiddleware,
    authorizeRoles("ADMIN"),
    adminController.getAllUsers
);

router.get(
    "/bids",
    authMiddleware,
    authorizeRoles("ADMIN"),
    adminController.getAllBids
);

router.get(
    "/notifications",
    authMiddleware,
    authorizeRoles("ADMIN"),
    adminController.getAllNotifications
);

router.get(
    "/dashboard",
    authMiddleware,
    authorizeRoles("ADMIN"),
    adminController.getAdminDashboard
);

router.post(
    "/run-daily-winner",
    authMiddleware,
    authorizeRoles("ADMIN"),
    async (req, res, next) => {
        try {
            const result = await dailyWinnerJob();

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    "/api-key-usage",
    authMiddleware,
    authorizeRoles("ADMIN"),
    adminController.getApiKeyUsageStats
);

module.exports = router;