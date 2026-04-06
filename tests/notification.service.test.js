jest.mock('../src/repositories/notification.repository', () => ({
    createNotification: jest.fn(),
    findNotificationsByUserId: jest.fn(),
    findUnreadNotificationsByUserId: jest.fn(),
    findNotificationByIdAndUserId: jest.fn(),
    updateNotification: jest.fn(),
    markAllNotificationsAsRead: jest.fn(),
    deleteNotification: jest.fn(),
}));

jest.mock('../src/repositories/auth.repository', () => ({
    findUserById: jest.fn(),
}));

const notificationRepository = require('../src/repositories/notification.repository');
const authRepository = require('../src/repositories/auth.repository');
const notificationService = require('../src/services/notification.service');

describe('Notification Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createNotification', () => {
        it('should throw 404 if user does not exist', async () => {
            authRepository.findUserById.mockResolvedValue(null);

            await expect(
                notificationService.createNotification('user-1', {
                    title: 'Bid Updated',
                    message: 'Your bid was updated',
                    type: 'BID_UPDATED',
                })
            ).rejects.toMatchObject({
                message: 'User not found',
                statusCode: 404,
            });
        });

        it('should create notification when user exists', async () => {
            authRepository.findUserById.mockResolvedValue({
                id: 'user-1',
                email: 'test@example.com',
            });

            notificationRepository.createNotification.mockResolvedValue({
                id: 'notif-1',
                userId: 'user-1',
                title: 'Bid Updated',
                message: 'Your bid was updated',
                type: 'BID_UPDATED',
                isRead: false,
            });

            const result = await notificationService.createNotification('user-1', {
                title: 'Bid Updated',
                message: 'Your bid was updated',
                type: 'BID_UPDATED',
            });

            expect(notificationRepository.createNotification).toHaveBeenCalled();
            expect(result).toHaveProperty('id', 'notif-1');
        });
    });

    describe('getMyNotifications', () => {
        it('should return notifications for valid user', async () => {
            authRepository.findUserById.mockResolvedValue({
                id: 'user-1',
                email: 'test@example.com',
            });

            notificationRepository.findNotificationsByUserId.mockResolvedValue([
                { id: 'notif-1', userId: 'user-1' },
            ]);

            const result = await notificationService.getMyNotifications('user-1');

            expect(result).toHaveLength(1);
        });
    });

    describe('markNotificationAsRead', () => {
        it('should throw 404 if notification not found', async () => {
            notificationRepository.findNotificationByIdAndUserId.mockResolvedValue(null);

            await expect(
                notificationService.markNotificationAsRead('user-1', 'notif-1')
            ).rejects.toMatchObject({
                message: 'Notification not found',
                statusCode: 404,
            });
        });

        it('should return notification if already read', async () => {
            notificationRepository.findNotificationByIdAndUserId.mockResolvedValue({
                id: 'notif-1',
                userId: 'user-1',
                isRead: true,
            });

            const result = await notificationService.markNotificationAsRead(
                'user-1',
                'notif-1'
            );

            expect(result).toHaveProperty('isRead', true);
        });

        it('should update notification to read if unread', async () => {
            notificationRepository.findNotificationByIdAndUserId.mockResolvedValue({
                id: 'notif-1',
                userId: 'user-1',
                isRead: false,
            });

            notificationRepository.updateNotification.mockResolvedValue({
                id: 'notif-1',
                userId: 'user-1',
                isRead: true,
            });

            const result = await notificationService.markNotificationAsRead(
                'user-1',
                'notif-1'
            );

            expect(notificationRepository.updateNotification).toHaveBeenCalledWith(
                'notif-1',
                { isRead: true }
            );
            expect(result).toHaveProperty('isRead', true);
        });
    });
});