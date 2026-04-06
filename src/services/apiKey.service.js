const crypto = require('crypto');

const apiKeyRepository = require('../repositories/apiKey.repository');
const authRepository = require('../repositories/auth.repository');

const ensureUserExists = async (userId) => {
    const user = await authRepository.findUserById(userId);

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    return user;
};

const ensureApiKeyExistsForUser = async (userId, apiKeyId) => {
    const apiKey = await apiKeyRepository.findApiKeyByIdAndUserId(apiKeyId, userId);

    if (!apiKey) {
        const error = new Error('API key not found');
        error.statusCode = 404;
        throw error;
    }

    return apiKey;
};

const generateUniqueApiKey = async () => {
    let generatedKey;
    let existingKey;

    do {
        generatedKey = `aim_${crypto.randomBytes(32).toString('hex')}`;
        existingKey = await apiKeyRepository.findApiKeyByKey(generatedKey);
    } while (existingKey);

    return generatedKey;
};

const createApiKey = async (userId, payload) => {
    await ensureUserExists(userId);

    const key = await generateUniqueApiKey();

    return apiKeyRepository.createApiKey({
        userId,
        name: payload.name,
        key,
    });
};

const getMyApiKeys = async (userId) => {
    await ensureUserExists(userId);
    return apiKeyRepository.findApiKeysByUserId(userId);
};

const getMyActiveApiKeys = async (userId) => {
    await ensureUserExists(userId);
    return apiKeyRepository.findActiveApiKeysByUserId(userId);
};

const revokeApiKey = async (userId, apiKeyId) => {
    const apiKey = await ensureApiKeyExistsForUser(userId, apiKeyId);

    if (!apiKey.isActive) {
        return apiKey;
    }

    return apiKeyRepository.revokeApiKey(apiKeyId);
};

const deleteApiKey = async (userId, apiKeyId) => {
    await ensureApiKeyExistsForUser(userId, apiKeyId);
    return apiKeyRepository.deleteApiKey(apiKeyId);
};

module.exports = {
    createApiKey,
    getMyApiKeys,
    getMyActiveApiKeys,
    revokeApiKey,
    deleteApiKey,
};