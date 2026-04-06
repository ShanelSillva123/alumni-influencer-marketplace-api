const authService = require('../services/auth.service');

const getRequestMeta = (req) => {
    return {
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
    };
};

const register = async (req, res, next) => {
    try {
        const result = await authService.registerUser(req.body, getRequestMeta(req));

        return res.status(201).json({
            status: 'success',
            message: result.message,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const verifyEmail = async (req, res, next) => {
    try {
        const result = await authService.verifyEmail(req.body, getRequestMeta(req));

        return res.status(200).json({
            status: 'success',
            message: result.message,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const resendVerification = async (req, res, next) => {
    try {
        const result = await authService.resendVerificationEmail(req.body, getRequestMeta(req));

        return res.status(200).json({
            status: 'success',
            message: result.message,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.loginUser(req.body, getRequestMeta(req));

        return res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        const result = await authService.logoutUser(req.user, getRequestMeta(req));

        return res.status(200).json({
            status: 'success',
            message: result.message,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const me = async (req, res, next) => {
    try {
        const result = await authService.getCurrentUser(req.user.id);

        return res.status(200).json({
            status: 'success',
            message: 'Current user fetched successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const result = await authService.forgotPassword(req.body, getRequestMeta(req));

        return res.status(200).json({
            status: 'success',
            message: result.message,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const result = await authService.resetPassword(req.body, getRequestMeta(req));

        return res.status(200).json({
            status: 'success',
            message: result.message,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const result = await authService.changePassword(
            {
                userId: req.user.id,
                currentPassword: req.body.currentPassword,
                newPassword: req.body.newPassword
            },
            getRequestMeta(req)
        );

        return res.status(200).json({
            status: 'success',
            message: result.message,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    verifyEmail,
    resendVerification,
    login,
    logout,
    me,
    forgotPassword,
    resetPassword,
    changePassword
};