const profileRepository = require('../repositories/profile.repository');

const calculateProfileCompletenessScore = (profile) => {
    const fields = [
        profile.fullName,
        profile.biography,
        profile.linkedInUrl,
        profile.profileImageUrl,
        profile.currentJobTitle,
        profile.currentCompany,
    ];

    const filledFields = fields.filter((value) => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string' && value.trim() === '') return false;
        return true;
    }).length;

    return Math.round((filledFields / fields.length) * 100);
};

const createProfile = async (userId, payload) => {
    const existingProfile = await profileRepository.findProfileByUserId(userId);

    if (existingProfile) {
        const error = new Error('Profile already exists for this user');
        error.statusCode = 409;
        throw error;
    }

    const profileCompletenessScore = calculateProfileCompletenessScore(payload);

    return profileRepository.createProfile({
        userId,
        ...payload,
        profileCompletenessScore,
    });
};

const getMyProfile = async (userId) => {
    const profile = await profileRepository.findProfileByUserId(userId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    return profile;
};

const getProfileById = async (profileId) => {
    const profile = await profileRepository.findProfileById(profileId);

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    return profile;
};

const getAllProfiles = async () => {
    return profileRepository.listProfiles();
};

const updateMyProfile = async (userId, payload) => {
    const existingProfile = await profileRepository.findProfileByUserId(userId);

    if (!existingProfile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    const mergedProfile = {
        ...existingProfile,
        ...payload,
    };

    const profileCompletenessScore =
        calculateProfileCompletenessScore(mergedProfile);

    return profileRepository.updateProfileByUserId(userId, {
        ...payload,
        profileCompletenessScore,
    });
};

const deleteMyProfile = async (userId) => {
    const existingProfile = await profileRepository.findProfileByUserId(userId);

    if (!existingProfile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    return profileRepository.deleteProfileByUserId(userId);
};

module.exports = {
    createProfile,
    getMyProfile,
    getProfileById,
    getAllProfiles,
    updateMyProfile,
    deleteMyProfile,
};