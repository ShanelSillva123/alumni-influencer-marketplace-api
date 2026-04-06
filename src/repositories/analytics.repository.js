const prisma = require('../models/prisma');

const getProfileByUserId = async (userId) => {
    return prisma.profile.findUnique({
        where: { userId },
        include: {
            degrees: true,
            certifications: true,
            licences: true,
            shortCourses: true,
            employmentHistory: true,
        },
    });
};

const countBidsByUserId = async (userId) => {
    return prisma.bid.count({
        where: { userId },
    });
};

const countActiveBidsByUserId = async (userId) => {
    return prisma.bid.count({
        where: {
            userId,
            isActive: true,
        },
    });
};

const countBidsByStatus = async (userId, status) => {
    return prisma.bid.count({
        where: {
            userId,
            status,
        },
    });
};

const countNotificationsByUserId = async (userId) => {
    return prisma.notification.count({
        where: { userId },
    });
};

const countUnreadNotificationsByUserId = async (userId) => {
    return prisma.notification.count({
        where: {
            userId,
            isRead: false,
        },
    });
};

module.exports = {
    getProfileByUserId,
    countBidsByUserId,
    countActiveBidsByUserId,
    countBidsByStatus,
    countNotificationsByUserId,
    countUnreadNotificationsByUserId,
};