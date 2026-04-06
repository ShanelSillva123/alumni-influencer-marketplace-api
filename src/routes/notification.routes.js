const express = require('express');
const router = express.Router();

const notificationController = require('../controllers/notification.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const {
    createNotification,
    notificationIdParam,
} = require('../utils/validators');

router.post(
    '/',
    authMiddleware,
    validate(createNotification),
    notificationController.createNotification
);

router.get(
    '/my',
    authMiddleware,
    notificationController.getMyNotifications
);

router.get(
    '/my/unread',
    authMiddleware,
    notificationController.getMyUnreadNotifications
);

router.patch(
    '/:id/read',
    authMiddleware,
    validate(notificationIdParam, 'params'),
    notificationController.markNotificationAsRead
);

router.patch(
    '/read-all',
    authMiddleware,
    notificationController.markAllNotificationsAsRead
);

router.delete(
    '/:id',
    authMiddleware,
    validate(notificationIdParam, 'params'),
    notificationController.deleteNotification
);

module.exports = router;