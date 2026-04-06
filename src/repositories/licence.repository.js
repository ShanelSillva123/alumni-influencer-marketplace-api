const prisma = require('../models/prisma');

const createLicence = async (data) => {
    return prisma.licence.create({
        data,
    });
};

const findLicencesByProfileId = async (profileId) => {
    return prisma.licence.findMany({
        where: { profileId },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

const findLicenceByIdAndProfileId = async (id, profileId) => {
    return prisma.licence.findFirst({
        where: {
            id,
            profileId,
        },
    });
};

const updateLicence = async (id, data) => {
    return prisma.licence.update({
        where: { id },
        data,
    });
};

const deleteLicence = async (id) => {
    return prisma.licence.delete({
        where: { id },
    });
};

module.exports = {
    createLicence,
    findLicencesByProfileId,
    findLicenceByIdAndProfileId,
    updateLicence,
    deleteLicence,
};