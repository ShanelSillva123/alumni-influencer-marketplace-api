const prisma = require('../models/prisma');

module.exports = async () => {
    try {
        const now = new Date();

        await prisma.refreshToken.deleteMany({
            where: {
                expiresAt: {
                    lt: now,
                },
            },
        });

        console.log('Expired tokens cleaned');
    } catch (error) {
        console.error('Token Cleanup Job Error:', error);
    }
};