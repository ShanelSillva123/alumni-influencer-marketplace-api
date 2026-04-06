const employmentRepository = require('../repositories/employment.repository');
const profileRepository = require('../repositories/profile.repository');

const createEmployment = async (userId, payload) => {
    const profile = await profileRepository.findProfileByUserId(userId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    return employmentRepository.createEmployment({
        profileId: profile.id,
        ...payload,
    });
};

const getMyEmployments = async (userId) => {
    const profile = await profileRepository.findProfileByUserId(userId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    return employmentRepository.findEmploymentsByProfileId(profile.id);
};

const getEmploymentsByProfileId = async (profileId) => {
    const profile = await profileRepository.findProfileById(profileId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    return employmentRepository.findEmploymentsByProfileId(profileId);
};

const updateEmployment = async (userId, employmentId, payload) => {
    const profile = await profileRepository.findProfileByUserId(userId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    const existingEmployment =
        await employmentRepository.findEmploymentByIdAndProfileId(
            employmentId,
            profile.id
        );

    if (!existingEmployment) {
        const error = new Error('Employment history record not found');
        error.statusCode = 404;
        throw error;
    }

    return employmentRepository.updateEmployment(employmentId, payload);
};

const deleteEmployment = async (userId, employmentId) => {
    const profile = await profileRepository.findProfileByUserId(userId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    const existingEmployment =
        await employmentRepository.findEmploymentByIdAndProfileId(
            employmentId,
            profile.id
        );

    if (!existingEmployment) {
        const error = new Error('Employment history record not found');
        error.statusCode = 404;
        throw error;
    }

    return employmentRepository.deleteEmployment(employmentId);
};

module.exports = {
    createEmployment,
    getMyEmployments,
    getEmploymentsByProfileId,
    updateEmployment,
    deleteEmployment,
};