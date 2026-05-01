const prisma = require('../models/prisma');

/**
 * Create a degree
 */
const createDegree = async (data) => {
    return prisma.degree.create({
        data,
    });
};

/**
 * Find all degrees by profileId
 */
const findDegreesByProfileId = async (profileId) => {
    return prisma.degree.findMany({
        where: { profileId },
        orderBy: { completionDate: "desc" },
    });
};
/**
 * Find degree by ID
 */
const findDegreeById = async (id) => {
    return prisma.degree.findUnique({
        where: { id },
    });
};

/**
 * Update degree
 */
const updateDegree = async (id, data) => {
    return prisma.degree.update({
        where: { id },
        data,
    });
};

/**
 * Delete degree
 */
const deleteDegree = async (id) => {
    return prisma.degree.delete({
        where: { id },
    });
};

/**
 * Check ownership (very important for security)
 * Ensures the degree belongs to the user's profile
 */
const findDegreeByIdAndProfileId = async (id, profileId) => {
    return prisma.degree.findFirst({
        where: {
            id,
            profileId,
        },
    });
};

module.exports = {
    createDegree,
    findDegreesByProfileId,
    findDegreeById,
    updateDegree,
    deleteDegree,
    findDegreeByIdAndProfileId,
};