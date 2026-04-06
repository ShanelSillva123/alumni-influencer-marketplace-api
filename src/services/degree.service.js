const degreeRepository = require('../repositories/degree.repository');
const profileRepository = require('../repositories/profile.repository');

const createDegree = async (userId, payload) => {
    const profile = await profileRepository.findProfileByUserId(userId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    return degreeRepository.createDegree({
        profileId: profile.id,
        ...payload,
    });
};

const getMyDegrees = async (userId) => {
    const profile = await profileRepository.findProfileByUserId(userId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    return degreeRepository.findDegreesByProfileId(profile.id);
};

const getDegreesByProfileId = async (profileId) => {
    const profile = await profileRepository.findProfileById(profileId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    return degreeRepository.findDegreesByProfileId(profileId);
};

const updateDegree = async (userId, degreeId, payload) => {
    const profile = await profileRepository.findProfileByUserId(userId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    const existingDegree = await degreeRepository.findDegreeByIdAndProfileId(
        degreeId,
        profile.id
    );

    if (!existingDegree) {
        const error = new Error('Degree not found');
        error.statusCode = 404;
        throw error;
    }

    return degreeRepository.updateDegree(degreeId, payload);
};

const deleteDegree = async (userId, degreeId) => {
    const profile = await profileRepository.findProfileByUserId(userId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    const existingDegree = await degreeRepository.findDegreeByIdAndProfileId(
        degreeId,
        profile.id
    );

    if (!existingDegree) {
        const error = new Error('Degree not found');
        error.statusCode = 404;
        throw error;
    }

    return degreeRepository.deleteDegree(degreeId);
};

module.exports = {
    createDegree,
    getMyDegrees,
    getDegreesByProfileId,
    updateDegree,
    deleteDegree,
};