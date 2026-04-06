const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check header exists
        if (!authHeader) {
            return res.status(401).json({
                status: 'error',
                message: 'Authorization header missing'
            });
        }

        // Check Bearer format
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid authorization format. Use Bearer token'
            });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Token not provided'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'error',
                message: 'Token expired'
            });
        }

        return res.status(401).json({
            status: 'error',
            message: 'Invalid token'
        });
    }
};

/* OPTIONAL: Role-based middleware (VERY USEFUL FOR ADMIN FEATURES) */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied'
            });
        }

        next();
    };
};

module.exports = {
    authMiddleware,
    authorizeRoles
};