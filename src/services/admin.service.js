const adminRepository = require('../repositories/admin.repository');
const authRepository = require('../repositories/auth.repository');

const ensureAdminUser = async (userId) => {
    const user = await authRepository.findUserById(userId);

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    if (user.role !== 'ADMIN') {
        const error = new Error('Access denied');
        error.statusCode = 403;
        throw error;
    }

    return user;
};

const getAllUsers = async (adminUserId) => {
    await ensureAdminUser(adminUserId);
    return adminRepository.findAllUsers();
};

const getAllBids = async (adminUserId) => {
    await ensureAdminUser(adminUserId);
    return adminRepository.findAllBids();
};

const getAllNotifications = async (adminUserId) => {
    await ensureAdminUser(adminUserId);
    return adminRepository.findAllNotifications();
};

const getAdminDashboard = async (adminUserId) => {
    await ensureAdminUser(adminUserId);

    const [
        totalUsers,
        totalProfiles,
        totalBids,
        totalNotifications,
    ] = await Promise.all([
        adminRepository.countUsers(),
        adminRepository.countProfiles(),
        adminRepository.countBids(),
        adminRepository.countNotifications(),
    ]);

    return {
        users: {
            total: totalUsers,
        },
        profiles: {
            total: totalProfiles,
        },
        bids: {
            total: totalBids,
        },
        notifications: {
            total: totalNotifications,
        },
    };
};

/**
 * ✅ NEW — API Key Usage Stats (ADMIN ONLY)
 */
const getApiKeyUsageStats = async (adminUserId) => {
    await ensureAdminUser(adminUserId);
    return adminRepository.findApiKeyUsageStats();
};

module.exports = {
    getAllUsers,
    getAllBids,
    getAllNotifications,
    getAdminDashboard,
    getApiKeyUsageStats, // ✅ added
};