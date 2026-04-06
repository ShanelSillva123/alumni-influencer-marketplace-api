const prisma = require('../models/prisma');

const createNotification = async (data) => {
    return prisma.notification.create({
        data,
    });
};

const findNotificationsByUserId = async (userId) => {
    return prisma.notification.findMany({
        where: { userId },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

const findUnreadNotificationsByUserId = async (userId) => {
    return prisma.notification.findMany({
        where: {
            userId,
            isRead: false,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

const findNotificationByIdAndUserId = async (id, userId) => {
    return prisma.notification.findFirst({
        where: {
            id,
            userId,
        },
    });
};

const updateNotification = async (id, data) => {
    return prisma.notification.update({
        where: { id },
        data,
    });
};

const markAllNotificationsAsRead = async (userId) => {
    return prisma.notification.updateMany({
        where: {
            userId,
            isRead: false,
        },
        data: {
            isRead: true,
        },
    });
};

const deleteNotification = async (id) => {
    return prisma.notification.delete({
        where: { id },
    });
};

module.exports = {
    createNotification,
    findNotificationsByUserId,
    findUnreadNotificationsByUserId,
    findNotificationByIdAndUserId,
    updateNotification,
    markAllNotificationsAsRead,
    deleteNotification,
};