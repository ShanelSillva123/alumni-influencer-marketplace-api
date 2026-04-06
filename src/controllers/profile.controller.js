const profileService = require('../services/profile.service');

const createProfile = async (req, res, next) => {
    try {
        const profile = await profileService.createProfile(req.user.id, req.body);

        return res.status(201).json({
            success: true,
            message: 'Profile created successfully',
            data: profile,
        });
    } catch (error) {
        next(error);
    }
};

const getMyProfile = async (req, res, next) => {
    try {
        const profile = await profileService.getMyProfile(req.user.id);

        return res.status(200).json({
            success: true,
            message: 'Profile fetched successfully',
            data: profile,
        });
    } catch (error) {
        next(error);
    }
};

const getProfileById = async (req, res, next) => {
    try {
        const profile = await profileService.getProfileById(req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Profile fetched successfully',
            data: profile,
        });
    } catch (error) {
        next(error);
    }
};

const getAllProfiles = async (req, res, next) => {
    try {
        const profiles = await profileService.getAllProfiles();

        return res.status(200).json({
            success: true,
            message: 'Profiles fetched successfully',
            data: profiles,
        });
    } catch (error) {
        next(error);
    }
};

const updateMyProfile = async (req, res, next) => {
    try {
        const profile = await profileService.updateMyProfile(req.user.id, req.body);

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: profile,
        });
    } catch (error) {
        next(error);
    }
};

const deleteMyProfile = async (req, res, next) => {
    try {
        await profileService.deleteMyProfile(req.user.id);

        return res.status(200).json({
            success: true,
            message: 'Profile deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProfile,
    getMyProfile,
    getProfileById,
    getAllProfiles,
    updateMyProfile,
    deleteMyProfile,
};