// src/routes/admin.routes.js

const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

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

module.exports = router;