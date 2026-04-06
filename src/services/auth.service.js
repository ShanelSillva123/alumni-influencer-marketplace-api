const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const authRepository = require('../repositories/auth.repository');

const SALT_ROUNDS = 10;
const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const ACCOUNT_LOCK_MINUTES = 15;
const EMAIL_VERIFICATION_TOKEN_HOURS = 24;
const PASSWORD_RESET_TOKEN_HOURS = 1;

const getExpiryDate = (hours) => {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    return date;
};

const generateSecureToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

const isUniversityEmail = (email) => {
    const allowedDomains = ['.ac.uk', '.edu'];
    return allowedDomains.some((domain) => email.toLowerCase().endsWith(domain));
};

const isStrongPassword = (password) => {
    const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}\-_=+\\|;:'",<.>/?`~]).{8,}$/;

    return strongPasswordRegex.test(password);
};

const createJwt = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d'
        }
    );
};

const registerUser = async ({ email, password, role }, meta = {}) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!isUniversityEmail(normalizedEmail)) {
        const error = new Error('Only university email addresses are allowed');
        error.status = 400;
        throw error;
    }

    if (!isStrongPassword(password)) {
        const error = new Error(
            'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'
        );
        error.status = 400;
        throw error;
    }

    const existingUser = await authRepository.findUserByEmail(normalizedEmail);

    if (existingUser) {
        await authRepository.createAuthActivityLog({
            email: normalizedEmail,
            action: 'REGISTER',
            ipAddress: meta.ipAddress,
            userAgent: meta.userAgent,
            success: false
        });

        const error = new Error('User already exists');
        error.status = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const verificationToken = generateSecureToken();
    const expiresAt = getExpiryDate(EMAIL_VERIFICATION_TOKEN_HOURS);

    const { user } = await authRepository.createUserWithVerificationToken({
        email: normalizedEmail,
        password: hashedPassword,
        role: role || 'USER',
        token: verificationToken,
        expiresAt
    });

    await authRepository.createAuthActivityLog({
        userId: user.id,
        email: user.email,
        action: 'REGISTER',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        success: true
    });

    return {
        message: 'User registered successfully. Please verify your email.',
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified
        },
        verificationToken
    };
};

const verifyEmail = async ({ token }, meta = {}) => {
    const verificationToken = await authRepository.findEmailVerificationToken(token);

    if (!verificationToken) {
        const error = new Error('Invalid verification token');
        error.status = 400;
        throw error;
    }

    if (verificationToken.used) {
        const error = new Error('Verification token has already been used');
        error.status = 400;
        throw error;
    }

    if (verificationToken.expiresAt < new Date()) {
        const error = new Error('Verification token has expired');
        error.status = 400;
        throw error;
    }

    const user = await authRepository.markUserAsVerified(verificationToken.userId);
    await authRepository.markEmailVerificationTokenAsUsed(verificationToken.id);

    await authRepository.createAuthActivityLog({
        userId: user.id,
        email: user.email,
        action: 'VERIFY_EMAIL',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        success: true
    });

    return {
        message: 'Email verified successfully',
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified
        }
    };
};

const resendVerificationEmail = async ({ email }, meta = {}) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await authRepository.findUserByEmail(normalizedEmail);

    if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }

    if (user.isVerified) {
        const error = new Error('Email is already verified');
        error.status = 400;
        throw error;
    }

    await authRepository.invalidateUnusedEmailVerificationTokens(user.id);

    const verificationToken = generateSecureToken();
    const expiresAt = getExpiryDate(EMAIL_VERIFICATION_TOKEN_HOURS);

    await authRepository.createEmailVerificationToken({
        userId: user.id,
        token: verificationToken,
        expiresAt
    });

    await authRepository.createAuthActivityLog({
        userId: user.id,
        email: user.email,
        action: 'RESEND_VERIFICATION',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        success: true
    });

    return {
        message: 'Verification email has been resent',
        verificationToken
    };
};

const loginUser = async ({ email, password }, meta = {}) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await authRepository.findUserByEmail(normalizedEmail);

    if (!user) {
        await authRepository.createAuthActivityLog({
            email: normalizedEmail,
            action: 'LOGIN',
            ipAddress: meta.ipAddress,
            userAgent: meta.userAgent,
            success: false
        });

        const error = new Error('Invalid email or password');
        error.status = 401;
        throw error;
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
        await authRepository.createAuthActivityLog({
            userId: user.id,
            email: user.email,
            action: 'LOGIN',
            ipAddress: meta.ipAddress,
            userAgent: meta.userAgent,
            success: false
        });

        const error = new Error('Account is temporarily locked. Please try again later.');
        error.status = 423;
        throw error;
    }

    if (!user.isVerified) {
        await authRepository.createAuthActivityLog({
            userId: user.id,
            email: user.email,
            action: 'LOGIN',
            ipAddress: meta.ipAddress,
            userAgent: meta.userAgent,
            success: false
        });

        const error = new Error('Please verify your email before logging in');
        error.status = 403;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        const nextAttempts = user.failedLoginAttempts + 1;
        let lockedUntil = null;

        if (nextAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
            lockedUntil = new Date(Date.now() + ACCOUNT_LOCK_MINUTES * 60 * 1000);
        }

        await authRepository.incrementFailedLoginAttempts(user.id, nextAttempts, lockedUntil);

        await authRepository.createAuthActivityLog({
            userId: user.id,
            email: user.email,
            action: 'LOGIN',
            ipAddress: meta.ipAddress,
            userAgent: meta.userAgent,
            success: false
        });

        const error = new Error('Invalid email or password');
        error.status = 401;
        throw error;
    }

    await authRepository.updateLastLogin(user.id);

    await authRepository.createAuthActivityLog({
        userId: user.id,
        email: user.email,
        action: 'LOGIN',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        success: true
    });

    const token = createJwt(user);

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified
        }
    };
};

const logoutUser = async (user, meta = {}) => {
    await authRepository.createAuthActivityLog({
        userId: user.id,
        email: user.email,
        action: 'LOGOUT',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        success: true
    });

    return {
        message: 'Logout successful'
    };
};

const getCurrentUser = async (userId) => {
    const user = await authRepository.findUserById(userId);

    if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }

    return {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt
    };
};

const forgotPassword = async ({ email }, meta = {}) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await authRepository.findUserByEmail(normalizedEmail);

    if (user) {
        await authRepository.invalidateUnusedPasswordResetTokens(user.id);

        const resetToken = generateSecureToken();
        const expiresAt = getExpiryDate(PASSWORD_RESET_TOKEN_HOURS);

        await authRepository.createPasswordResetToken({
            userId: user.id,
            token: resetToken,
            expiresAt
        });

        await authRepository.createAuthActivityLog({
            userId: user.id,
            email: user.email,
            action: 'FORGOT_PASSWORD',
            ipAddress: meta.ipAddress,
            userAgent: meta.userAgent,
            success: true
        });

        return {
            message: 'If the account exists, a password reset link has been generated',
            resetToken
        };
    }

    return {
        message: 'If the account exists, a password reset link has been generated'
    };
};

const resetPassword = async ({ token, newPassword }, meta = {}) => {
    if (!isStrongPassword(newPassword)) {
        const error = new Error(
            'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'
        );
        error.status = 400;
        throw error;
    }

    const resetToken = await authRepository.findPasswordResetToken(token);

    if (!resetToken) {
        const error = new Error('Invalid password reset token');
        error.status = 400;
        throw error;
    }

    if (resetToken.used) {
        const error = new Error('Password reset token has already been used');
        error.status = 400;
        throw error;
    }

    if (resetToken.expiresAt < new Date()) {
        const error = new Error('Password reset token has expired');
        error.status = 400;
        throw error;
    }

    const user = await authRepository.findUserById(resetToken.userId);

    if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await authRepository.updatePassword(user.id, hashedPassword);
    await authRepository.markPasswordResetTokenAsUsed(resetToken.id);
    await authRepository.resetFailedLoginAttempts(user.id);

    await authRepository.createAuthActivityLog({
        userId: user.id,
        email: user.email,
        action: 'RESET_PASSWORD',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        success: true
    });

    return {
        message: 'Password reset successfully'
    };
};

const changePassword = async ({ userId, currentPassword, newPassword }, meta = {}) => {
    const user = await authRepository.findUserById(userId);

    if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
        const error = new Error('Current password is incorrect');
        error.status = 400;
        throw error;
    }

    if (!isStrongPassword(newPassword)) {
        const error = new Error(
            'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'
        );
        error.status = 400;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await authRepository.updatePassword(user.id, hashedPassword);

    await authRepository.createAuthActivityLog({
        userId: user.id,
        email: user.email,
        action: 'CHANGE_PASSWORD',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        success: true
    });

    return {
        message: 'Password changed successfully'
    };
};

module.exports = {
    registerUser,
    verifyEmail,
    resendVerificationEmail,
    loginUser,
    logoutUser,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    changePassword
};