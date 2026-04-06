const courseRepository = require('../repositories/course.repository');
const profileRepository = require('../repositories/profile.repository');

const createCourse = async (userId, payload) => {
    const profile = await profileRepository.findProfileByUserId(userId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    return courseRepository.createCourse({
        profileId: profile.id,
        ...payload,
    });
};

const getMyCourses = async (userId) => {
    const profile = await profileRepository.findProfileByUserId(userId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    return courseRepository.findCoursesByProfileId(profile.id);
};

const getCoursesByProfileId = async (profileId) => {
    const profile = await profileRepository.findProfileById(profileId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    return courseRepository.findCoursesByProfileId(profileId);
};

const updateCourse = async (userId, courseId, payload) => {
    const profile = await profileRepository.findProfileByUserId(userId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    const existingCourse =
        await courseRepository.findCourseByIdAndProfileId(
            courseId,
            profile.id
        );

    if (!existingCourse) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
    }

    return courseRepository.updateCourse(courseId, payload);
};

const deleteCourse = async (userId, courseId) => {
    const profile = await profileRepository.findProfileByUserId(userId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    const existingCourse =
        await courseRepository.findCourseByIdAndProfileId(
            courseId,
            profile.id
        );

    if (!existingCourse) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
    }

    return courseRepository.deleteCourse(courseId);
};

module.exports = {
    createCourse,
    getMyCourses,
    getCoursesByProfileId,
    updateCourse,
    deleteCourse,
};