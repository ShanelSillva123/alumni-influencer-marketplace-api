const sanitizeValue = (value) => {
    if (typeof value === 'string') {
        return value
            .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
            .replace(/<\/?script[^>]*>/gi, '')
            .replace(/on\w+="[^"]*"/gi, '')
            .replace(/on\w+='[^']*'/gi, '')
            .replace(/javascript:/gi, '')
            .trim();
    }

    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }

    if (value && typeof value === 'object') {
        const sanitized = {};
        for (const key in value) {
            sanitized[key] = sanitizeValue(value[key]);
        }
        return sanitized;
    }

    return value;
};

const sanitizeMiddleware = (req, res, next) => {
    if (req.body) req.body = sanitizeValue(req.body);
    if (req.query) req.query = sanitizeValue(req.query);
    if (req.params) req.params = sanitizeValue(req.params);

    next();
};

module.exports = sanitizeMiddleware;