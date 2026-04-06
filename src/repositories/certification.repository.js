const prisma = require('../models/prisma');

const createCertification = async (data) => {
    return prisma.certification.create({
        data,
    });
};

const findCertificationsByProfileId = async (profileId) => {
    return prisma.certification.findMany({
        where: { profileId },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

const findCertificationByIdAndProfileId = async (id, profileId) => {
    return prisma.certification.findFirst({
        where: {
            id,
            profileId,
        },
    });
};

const updateCertification = async (id, data) => {
    return prisma.certification.update({
        where: { id },
        data,
    });
};

const deleteCertification = async (id) => {
    return prisma.certification.delete({
        where: { id },
    });
};

module.exports = {
    createCertification,
    findCertificationsByProfileId,
    findCertificationByIdAndProfileId,
    updateCertification,
    deleteCertification,
};