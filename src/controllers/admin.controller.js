const adminService = require('../services/admin.service');

const getAllUsers = async (req, res, next) => {
    try {
        const users = await adminService.getAllUsers(req.user.id);

        return res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

const getAllBids = async (req, res, next) => {
    try {
        const bids = await adminService.getAllBids(req.user.id);

        return res.status(200).json({
            success: true,
            message: 'Bids fetched successfully',
            data: bids,
        });
    } catch (error) {
        next(error);
    }
};

const getAllNotifications = async (req, res, next) => {
    try {
        const notifications = await adminService.getAllNotifications(req.user.id);

        return res.status(200).json({
            success: true,
            message: 'Notifications fetched successfully',
            data: notifications,
        });
    } catch (error) {
        next(error);
    }
};

const getAdminDashboard = async (req, res, next) => {
    try {
        const dashboard = await adminService.getAdminDashboard(req.user.id);

        return res.status(200).json({
            success: true,
            message: 'Admin dashboard fetched successfully',
            data: dashboard,
        });
    } catch (error) {
        next(error);
    }
};

const getApiKeyUsageStats = async (req, res, next) => {
    try {
        const usageStats = await adminService.getApiKeyUsageStats(req.user.id);

        return res.status(200).json({
            success: true,
            message: 'API key usage statistics fetched successfully',
            data: usageStats,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    getAllBids,
    getAllNotifications,
    getAdminDashboard,
    getApiKeyUsageStats,
};