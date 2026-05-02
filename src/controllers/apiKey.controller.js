const apiKeyService = require('../services/apiKey.service');

const createApiKey = async (req, res, next) => {
    try {
        const apiKey = await apiKeyService.createApiKey(req.user.id, req.body);

        return res.status(201).json({
            success: true,
            message: 'API key created successfully',
            data: apiKey,
        });
    } catch (error) {
        next(error);
    }
};

const getMyApiKeys = async (req, res, next) => {
    try {
        const apiKeys = await apiKeyService.getMyApiKeys(req.user.id);

        return res.status(200).json({
            success: true,
            message: 'API keys fetched successfully',
            data: apiKeys,
        });
    } catch (error) {
        next(error);
    }
};

const getMyActiveApiKeys = async (req, res, next) => {
    try {
        const apiKeys = await apiKeyService.getMyActiveApiKeys(req.user.id);

        return res.status(200).json({
            success: true,
            message: 'Active API keys fetched successfully',
            data: apiKeys,
        });
    } catch (error) {
        next(error);
    }
};

const revokeApiKey = async (req, res, next) => {
    try {
        const apiKey = await apiKeyService.revokeApiKey(req.user.id, req.params.id);

        return res.status(200).json({
            success: true,
            message: 'API key revoked successfully',
            data: apiKey,
        });
    } catch (error) {
        next(error);
    }
};

const deleteApiKey = async (req, res, next) => {
    try {
        await apiKeyService.deleteApiKey(req.user.id, req.params.id);

        return res.status(200).json({
            success: true,
            message: 'API key deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

const updateMyApiKeyPermissions = async (req, res, next) => {
    try {
        const apiKey = await apiKeyService.updateMyApiKeyPermissions(
            req.user.id,
            req.params.id,
            req.body.permissions
        );

        return res.status(200).json({
            success: true,
            message: 'API key permissions updated successfully',
            data: apiKey,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createApiKey,
    getMyApiKeys,
    getMyActiveApiKeys,
    revokeApiKey,
    deleteApiKey,
    updateMyApiKeyPermissions
};