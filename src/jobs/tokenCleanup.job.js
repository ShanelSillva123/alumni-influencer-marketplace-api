const prisma = require('../models/prisma');

module.exports = async function tokenCleanupJob() {
    try {
        const now = new Date();

        const deletedEmailTokens = await prisma.emailVerificationToken.deleteMany({
            where: {
                expiresAt: {
                    lt: now,
                },
            },
        });

        const deletedPasswordTokens = await prisma.passwordResetToken.deleteMany({
            where: {
                expiresAt: {
                    lt: now,
                },
            },
        });

        console.log(
            `Token cleanup completed: ${deletedEmailTokens.count} email tokens, ${deletedPasswordTokens.count} password reset tokens deleted.`
        );
    } catch (error) {
        console.error("Token Cleanup Job Error:", error);
    }
};