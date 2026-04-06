const prisma = require('../models/prisma');

module.exports = async () => {
    try {
        // Example: reset all users' bid usage (if tracked)
        // You can extend this based on your logic

        await prisma.bid.updateMany({
            where: {
                isActive: false,
            },
            data: {
                isActive: false,
            },
        });

        console.log('Monthly reset completed');
    } catch (error) {
        console.error('Monthly Reset Job Error:', error);
    }
};