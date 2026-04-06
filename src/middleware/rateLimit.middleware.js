const rateLimit = require('express-rate-limit');

// 🔹 General API limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests. Please try again later.',
    },
});

// 🔹 Auth-specific (STRICT)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many authentication attempts. Try again later.',
    },
});

// 🔹 API Key limiter
const apiKeyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many API key requests. Try again later.',
    },
});

module.exports = {
    apiLimiter,
    authLimiter,
    apiKeyLimiter,
};