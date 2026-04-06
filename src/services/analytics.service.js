const analyticsRepository = require('../repositories/analytics.repository');
const authRepository = require('../repositories/auth.repository');

const ensureUserExists = async (userId) => {
    const user = await authRepository.findUserById(userId);

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    return user;
};

const calculateProfileCompleteness = (profile) => {
    if (!profile) {
        return 0;
    }

    let score = 0;

    if (profile.fullName && profile.fullName.trim() !== '') score += 15;
    if (profile.biography && profile.biography.trim() !== '') score += 15;
    if (profile.currentJobTitle && profile.currentJobTitle.trim() !== '') score += 10;
    if (profile.currentCompany && profile.currentCompany.trim() !== '') score += 10;
    if (profile.linkedInUrl && profile.linkedInUrl.trim() !== '') score += 10;
    if (profile.profileImageUrl && profile.profileImageUrl.trim() !== '') score += 10;
    if (profile.degrees && profile.degrees.length > 0) score += 10;
    if (profile.employmentHistory && profile.employmentHistory.length > 0) score += 10;
    if (profile.certifications && profile.certifications.length > 0) score += 5;
    if (profile.shortCourses && profile.shortCourses.length > 0) score += 2.5;
    if (profile.licences && profile.licences.length > 0) score += 2.5;

    return Math.min(100, score);
};

const getMyDashboardAnalytics = async (userId) => {
    await ensureUserExists(userId);

    const [
        profile,
        totalBids,
        activeBids,
        wonBids,
        lostBids,
        cancelledBids,
        totalNotifications,
        unreadNotifications,
    ] = await Promise.all([
        analyticsRepository.getProfileByUserId(userId),
        analyticsRepository.countBidsByUserId(userId),
        analyticsRepository.countActiveBidsByUserId(userId),
        analyticsRepository.countBidsByStatus(userId, 'WON'),
        analyticsRepository.countBidsByStatus(userId, 'LOST'),
        analyticsRepository.countBidsByStatus(userId, 'CANCELLED'),
        analyticsRepository.countNotificationsByUserId(userId),
        analyticsRepository.countUnreadNotificationsByUserId(userId),
    ]);

    const profileCompleteness = calculateProfileCompleteness(profile);

    return {
        profile: {
            exists: !!profile,
            completenessPercentage: profileCompleteness,
            fullName: profile?.fullName || null,
            currentJobTitle: profile?.currentJobTitle || null,
            currentCompany: profile?.currentCompany || null,
            totalDegrees: profile?.degrees?.length || 0,
            totalEmploymentHistory: profile?.employmentHistory?.length || 0,
            totalCertifications: profile?.certifications?.length || 0,
            totalCourses: profile?.shortCourses?.length || 0,
            totalLicences: profile?.licences?.length || 0,
        },
        bids: {
            total: totalBids,
            active: activeBids,
            won: wonBids,
            lost: lostBids,
            cancelled: cancelledBids,
        },
        notifications: {
            total: totalNotifications,
            unread: unreadNotifications,
            read: totalNotifications - unreadNotifications,
        },
    };
};

module.exports = {
    getMyDashboardAnalytics,
};