const prisma = require('../models/prisma');

const findAllUsers = async () => {
    return prisma.user.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            id: true,
            email: true,
            role: true,
            isVerified: true,
            lastLoginAt: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

const findAllBids = async () => {
    return prisma.bid.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                },
            },
        },
    });
};

const findAllNotifications = async () => {
    return prisma.notification.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                },
            },
        },
    });
};

const findApiKeyUsageStats = async () => {
    return prisma.apiKey.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            id: true,
            name: true,
            key: true,
            isActive: true,
            lastUsedAt: true,
            revokedAt: true,
            createdAt: true,
            updatedAt: true,
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                },
            },
            usageLogs: {
                orderBy: {
                    usedAt: 'desc',
                },
                take: 5,
                select: {
                    id: true,
                    endpoint: true,
                    method: true,
                    ipAddress: true,
                    userAgent: true,
                    usedAt: true,
                },
            },
            _count: {
                select: {
                    usageLogs: true,
                },
            },
        },
    });
};

const countUsers = async () => {
    return prisma.user.count();
};

const countProfiles = async () => {
    return prisma.profile.count();
};

const countBids = async () => {
    return prisma.bid.count();
};

const countNotifications = async () => {
    return prisma.notification.count();
};

module.exports = {
    findAllUsers,
    findAllBids,
    findAllNotifications,
    findApiKeyUsageStats,
    countUsers,
    countProfiles,
    countBids,
    countNotifications,
};