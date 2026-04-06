const prisma = require('../models/prisma');

const profileInclude = {
    degrees: true,
    certifications: true,
    licences: true,
    shortCourses: true,
    employmentHistory: true,
};

const createProfile = async (data) => {
    return prisma.profile.create({
        data,
        include: profileInclude,
    });
};

const findProfileById = async (id) => {
    return prisma.profile.findUnique({
        where: { id },
        include: profileInclude,
    });
};

const findProfileByUserId = async (userId) => {
    return prisma.profile.findUnique({
        where: { userId },
        include: profileInclude,
    });
};

const updateProfileByUserId = async (userId, data) => {
    return prisma.profile.update({
        where: { userId },
        data,
        include: profileInclude,
    });
};

const deleteProfileByUserId = async (userId) => {
    return prisma.profile.delete({
        where: { userId },
        include: profileInclude,
    });
};

const listProfiles = async () => {
    return prisma.profile.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: profileInclude,
    });
};

module.exports = {
    createProfile,
    findProfileById,
    findProfileByUserId,
    updateProfileByUserId,
    deleteProfileByUserId,
    listProfiles,
};