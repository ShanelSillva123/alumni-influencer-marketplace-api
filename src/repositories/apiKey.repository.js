const prisma = require('../models/prisma');

const createApiKey = async (data) => {
    return prisma.apiKey.create({
        data,
    });
};

const findApiKeysByUserId = async (userId) => {
    return prisma.apiKey.findMany({
        where: { userId },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

const findActiveApiKeysByUserId = async (userId) => {
    return prisma.apiKey.findMany({
        where: {
            userId,
            isActive: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

const findApiKeyByIdAndUserId = async (id, userId) => {
    return prisma.apiKey.findFirst({
        where: {
            id,
            userId,
        },
    });
};

const findApiKeyByKey = async (key) => {
    return prisma.apiKey.findUnique({
        where: { key },
    });
};

const updateApiKey = async (id, data) => {
    return prisma.apiKey.update({
        where: { id },
        data,
    });
};

const revokeApiKey = async (id) => {
    return prisma.apiKey.update({
        where: { id },
        data: {
            isActive: false,
            revokedAt: new Date(),
        },
    });
};

const deleteApiKey = async (id) => {
    return prisma.apiKey.delete({
        where: { id },
    });
};

module.exports = {
    createApiKey,
    findApiKeysByUserId,
    findActiveApiKeysByUserId,
    findApiKeyByIdAndUserId,
    findApiKeyByKey,
    updateApiKey,
    revokeApiKey,
    deleteApiKey,
};