const { logger } = require('../config/logger');

module.exports = (err, req, res, next) => {
    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method
    });

    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error'
    });
};