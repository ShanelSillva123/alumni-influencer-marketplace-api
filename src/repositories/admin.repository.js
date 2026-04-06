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
    countUsers,
    countProfiles,
    countBids,
    countNotifications,
};