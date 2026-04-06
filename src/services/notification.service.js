const notificationRepository = require('../repositories/notification.repository');
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

const ensureNotificationExistsForUser = async (userId, notificationId) => {
    const notification = await notificationRepository.findNotificationByIdAndUserId(
        notificationId,
        userId
    );

    if (!notification) {
        const error = new Error('Notification not found');
        error.statusCode = 404;
        throw error;
    }

    return notification;
};

const createNotification = async (userId, payload) => {
    await ensureUserExists(userId);

    return notificationRepository.createNotification({
        userId,
        title: payload.title,
        message: payload.message,
        type: payload.type,
    });
};

const getMyNotifications = async (userId) => {
    await ensureUserExists(userId);
    return notificationRepository.findNotificationsByUserId(userId);
};

const getMyUnreadNotifications = async (userId) => {
    await ensureUserExists(userId);
    return notificationRepository.findUnreadNotificationsByUserId(userId);
};

const markNotificationAsRead = async (userId, notificationId) => {
    const notification = await ensureNotificationExistsForUser(userId, notificationId);

    if (notification.isRead) {
        return notification;
    }

    return notificationRepository.updateNotification(notificationId, {
        isRead: true,
    });
};

const markAllNotificationsAsRead = async (userId) => {
    await ensureUserExists(userId);
    await notificationRepository.markAllNotificationsAsRead(userId);

    return {
        message: 'All notifications marked as read',
    };
};

const deleteNotification = async (userId, notificationId) => {
    await ensureNotificationExistsForUser(userId, notificationId);
    return notificationRepository.deleteNotification(notificationId);
};

module.exports = {
    createNotification,
    getMyNotifications,
    getMyUnreadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
};