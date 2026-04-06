const certificationRepository = require('../repositories/certification.repository');
const profileRepository = require('../repositories/profile.repository');

const getCertificationsByProfileId = async (profileId) => {
    const profile = await profileRepository.findProfileById(profileId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    return certificationRepository.findCertificationsByProfileId(profileId);
};

module.exports = {
    getCertificationsByProfileId,
};