const certificationRepository = require('../repositories/certification.repository');
const profileRepository = require('../repositories/profile.repository');

const createCertification = async (userId, payload) => {
    const profile = await profileRepository.findProfileByUserId(userId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    return certificationRepository.createCertification({
        profileId: profile.id,
        ...payload,
    });
};

const getMyCertifications = async (userId) => {
    const profile = await profileRepository.findProfileByUserId(userId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    return certificationRepository.findCertificationsByProfileId(profile.id);
};

const getCertificationsByProfileId = async (profileId) => {
    const profile = await profileRepository.findProfileById(profileId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    return certificationRepository.findCertificationsByProfileId(profileId);
};

const updateCertification = async (userId, certificationId, payload) => {
    const profile = await profileRepository.findProfileByUserId(userId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    const existingCertification =
        await certificationRepository.findCertificationByIdAndProfileId(
            certificationId,
            profile.id
        );

    if (!existingCertification) {
        const error = new Error('Certification not found');
        error.statusCode = 404;
        throw error;
    }

    return certificationRepository.updateCertification(certificationId, payload);
};

const deleteCertification = async (userId, certificationId) => {
    const profile = await profileRepository.findProfileByUserId(userId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    const existingCertification =
        await certificationRepository.findCertificationByIdAndProfileId(
            certificationId,
            profile.id
        );

    if (!existingCertification) {
        const error = new Error('Certification not found');
        error.statusCode = 404;
        throw error;
    }

    return certificationRepository.deleteCertification(certificationId);
};

module.exports = {
    createCertification,
    getMyCertifications,
    getCertificationsByProfileId,
    updateCertification,
    deleteCertification,
};