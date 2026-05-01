const prisma = require('../models/prisma');

/* =========================
   User Queries
========================= */

const findUserByEmail = async (email) => {
    return prisma.user.findUnique({
        where: { email },
    });
};
const findUserById = async (id) => {
    return prisma.user.findUnique({
        where: { id }
    });
};

const createUser = async ({ email, password, role = 'USER' }) => {
    return prisma.user.create({
        data: {
            email,
            password,
            role
        }
    });
};

const markUserAsVerified = async (userId) => {
    return prisma.user.update({
        where: { id: userId },
        data: {
            isVerified: true
        }
    });
};

const updateLastLogin = async (userId) => {
    return prisma.user.update({
        where: { id: userId },
        data: {
            lastLoginAt: new Date(),
            failedLoginAttempts: 0,
            lockedUntil: null
        }
    });
};

const incrementFailedLoginAttempts = async (userId, attempts, lockedUntil = null) => {
    return prisma.user.update({
        where: { id: userId },
        data: {
            failedLoginAttempts: attempts,
            lockedUntil
        }
    });
};

const resetFailedLoginAttempts = async (userId) => {
    return prisma.user.update({
        where: { id: userId },
        data: {
            failedLoginAttempts: 0,
            lockedUntil: null
        }
    });
};

const updatePassword = async (userId, hashedPassword) => {
    return prisma.user.update({
        where: { id: userId },
        data: {
            password: hashedPassword
        }
    });
};

/* =========================
   Email Verification Tokens
========================= */

const createEmailVerificationToken = async ({ userId, token, expiresAt }) => {
    return prisma.emailVerificationToken.create({
        data: {
            userId,
            token,
            expiresAt
        }
    });
};

const findEmailVerificationToken = async (token) => {
    return prisma.emailVerificationToken.findUnique({
        where: { token }
    });
};

const markEmailVerificationTokenAsUsed = async (tokenId) => {
    return prisma.emailVerificationToken.update({
        where: { id: tokenId },
        data: {
            used: true
        }
    });
};

const invalidateUnusedEmailVerificationTokens = async (userId) => {
    return prisma.emailVerificationToken.updateMany({
        where: {
            userId,
            used: false
        },
        data: {
            used: true
        }
    });
};

/* =========================
   Password Reset Tokens
========================= */

const createPasswordResetToken = async ({ userId, token, expiresAt }) => {
    return prisma.passwordResetToken.create({
        data: {
            userId,
            token,
            expiresAt
        }
    });
};

const findPasswordResetToken = async (token) => {
    return prisma.passwordResetToken.findUnique({
        where: { token }
    });
};

const markPasswordResetTokenAsUsed = async (tokenId) => {
    return prisma.passwordResetToken.update({
        where: { id: tokenId },
        data: {
            used: true
        }
    });
};

const invalidateUnusedPasswordResetTokens = async (userId) => {
    return prisma.passwordResetToken.updateMany({
        where: {
            userId,
            used: false
        },
        data: {
            used: true
        }
    });
};

/* =========================
   Auth Activity Logs
========================= */

const createAuthActivityLog = async ({
                                         userId = null,
                                         email = null,
                                         action,
                                         ipAddress = null,
                                         userAgent = null,
                                         success = true
                                     }) => {
    return prisma.authActivityLog.create({
        data: {
            userId,
            email,
            action,
            ipAddress,
            userAgent,
            success
        }
    });
};

/* =========================
   Transaction Helpers
========================= */

const createUserWithVerificationToken = async ({
                                                   email,
                                                   password,
                                                   role = 'USER',
                                                   token,
                                                   expiresAt
                                               }) => {
    return prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                email,
                password,
                role
            }
        });

        const verificationToken = await tx.emailVerificationToken.create({
            data: {
                userId: user.id,
                token,
                expiresAt
            }
        });

        return {
            user,
            verificationToken
        };
    });
};

module.exports = {
    findUserByEmail,
    findUserById,
    createUser,
    markUserAsVerified,
    updateLastLogin,
    incrementFailedLoginAttempts,
    resetFailedLoginAttempts,
    updatePassword,

    createEmailVerificationToken,
    findEmailVerificationToken,
    markEmailVerificationTokenAsUsed,
    invalidateUnusedEmailVerificationTokens,

    createPasswordResetToken,
    findPasswordResetToken,
    markPasswordResetTokenAsUsed,
    invalidateUnusedPasswordResetTokens,

    createAuthActivityLog,

    createUserWithVerificationToken
};