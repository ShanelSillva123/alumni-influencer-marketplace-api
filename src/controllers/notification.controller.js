const notificationService = require('../services/notification.service');

const createNotification = async (req, res, next) => {
    try {
        const notification = await notificationService.createNotification(
            req.user.id,
            req.body
        );

        return res.status(201).json({
            success: true,
            message: 'Notification created successfully',
            data: notification,
        });
    } catch (error) {
        next(error);
    }
};

const getMyNotifications = async (req, res, next) => {
    try {
        const notifications = await notificationService.getMyNotifications(req.user.id);

        return res.status(200).json({
            success: true,
            message: 'Notifications fetched successfully',
            data: notifications,
        });
    } catch (error) {
        next(error);
    }
};

const getMyUnreadNotifications = async (req, res, next) => {
    try {
        const notifications = await notificationService.getMyUnreadNotifications(
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message: 'Unread notifications fetched successfully',
            data: notifications,
        });
    } catch (error) {
        next(error);
    }
};

const markNotificationAsRead = async (req, res, next) => {
    try {
        const notification = await notificationService.markNotificationAsRead(
            req.user.id,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: 'Notification marked as read successfully',
            data: notification,
        });
    } catch (error) {
        next(error);
    }
};

const markAllNotificationsAsRead = async (req, res, next) => {
    try {
        const result = await notificationService.markAllNotificationsAsRead(req.user.id);

        return res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
};

const deleteNotification = async (req, res, next) => {
    try {
        await notificationService.deleteNotification(req.user.id, req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Notification deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createNotification,
    getMyNotifications,
    getMyUnreadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
};