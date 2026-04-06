const analyticsService = require('../services/analytics.service');

const getMyDashboardAnalytics = async (req, res, next) => {
    try {
        const analytics = await analyticsService.getMyDashboardAnalytics(req.user.id);

        return res.status(200).json({
            success: true,
            message: 'Dashboard analytics fetched successfully',
            data: analytics,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMyDashboardAnalytics,
};