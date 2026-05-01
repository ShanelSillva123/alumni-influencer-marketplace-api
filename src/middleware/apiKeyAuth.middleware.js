const prisma = require("../models/prisma");

const requireApiKeyPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const apiKeyValue = req.headers["x-api-key"];

            if (!apiKeyValue) {
                return res.status(401).json({
                    status: "error",
                    message: "API key is required",
                });
            }

            const apiKey = await prisma.apiKey.findUnique({
                where: { key: apiKeyValue },
            });

            if (!apiKey || !apiKey.isActive || apiKey.revokedAt) {
                return res.status(403).json({
                    status: "error",
                    message: "Invalid or revoked API key",
                });
            }

            if (
                requiredPermission &&
                !apiKey.permissions.includes(requiredPermission)
            ) {
                return res.status(403).json({
                    status: "error",
                    message: "API key does not have permission for this resource",
                });
            }

            await prisma.apiKey.update({
                where: { id: apiKey.id },
                data: { lastUsedAt: new Date() },
            });

            req.apiKey = apiKey;
            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = requireApiKeyPermission;