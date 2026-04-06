const prisma = require('../models/prisma');

const createEmployment = async (data) => {
    return prisma.employmentHistory.create({
        data,
    });
};

const findEmploymentsByProfileId = async (profileId) => {
    return prisma.employmentHistory.findMany({
        where: { profileId },
        orderBy: {
            startDate: 'desc',
        },
    });
};

const findEmploymentByIdAndProfileId = async (id, profileId) => {
    return prisma.employmentHistory.findFirst({
        where: {
            id,
            profileId,
        },
    });
};

const updateEmployment = async (id, data) => {
    return prisma.employmentHistory.update({
        where: { id },
        data,
    });
};

const deleteEmployment = async (id) => {
    return prisma.employmentHistory.delete({
        where: { id },
    });
};

module.exports = {
    createEmployment,
    findEmploymentsByProfileId,
    findEmploymentByIdAndProfileId,
    updateEmployment,
    deleteEmployment,
};