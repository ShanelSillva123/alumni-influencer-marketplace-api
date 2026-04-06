const prisma = require('../models/prisma');

const createCourse = async (data) => {
    return prisma.shortCourse.create({
        data,
    });
};

const findCoursesByProfileId = async (profileId) => {
    return prisma.shortCourse.findMany({
        where: { profileId },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

const findCourseByIdAndProfileId = async (id, profileId) => {
    return prisma.shortCourse.findFirst({
        where: {
            id,
            profileId,
        },
    });
};

const updateCourse = async (id, data) => {
    return prisma.shortCourse.update({
        where: { id },
        data,
    });
};

const deleteCourse = async (id) => {
    return prisma.shortCourse.delete({
        where: { id },
    });
};

module.exports = {
    createCourse,
    findCoursesByProfileId,
    findCourseByIdAndProfileId,
    updateCourse,
    deleteCourse,
};