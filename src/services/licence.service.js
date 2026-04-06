const licenceRepository = require('../repositories/licence.repository');
const profileRepository = require('../repositories/profile.repository');

const createLicence = async (userId, payload) => {
    const profile = await profileRepository.findProfileByUserId(userId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    return licenceRepository.createLicence({
        profileId: profile.id,
        ...payload,
    });
};

const getMyLicences = async (userId) => {
    const profile = await profileRepository.findProfileByUserId(userId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    return licenceRepository.findLicencesByProfileId(profile.id);
};

const getLicencesByProfileId = async (profileId) => {
    const profile = await profileRepository.findProfileById(profileId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    return licenceRepository.findLicencesByProfileId(profileId);
};

const updateLicence = async (userId, licenceId, payload) => {
    const profile = await profileRepository.findProfileByUserId(userId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    const existingLicence = await licenceRepository.findLicenceByIdAndProfileId(
        licenceId,
        profile.id
    );

    if (!existingLicence) {
        const error = new Error('Licence not found');
        error.statusCode = 404;
        throw error;
    }

    return licenceRepository.updateLicence(licenceId, payload);
};

const deleteLicence = async (userId, licenceId) => {
    const profile = await profileRepository.findProfileByUserId(userId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    const existingLicence = await licenceRepository.findLicenceByIdAndProfileId(
        licenceId,
        profile.id
    );

    if (!existingLicence) {
        const error = new Error('Licence not found');
        error.statusCode = 404;
        throw error;
    }

    return licenceRepository.deleteLicence(licenceId);
};

module.exports = {
    createLicence,
    getMyLicences,
    getLicencesByProfileId,
    updateLicence,
    deleteLicence,
};