const degreeService = require('../services/degree.service');

const createDegree = async (req, res, next) => {
    try {
        const degree = await degreeService.createDegree(req.user.id, req.body);

        return res.status(201).json({
            success: true,
            message: 'Degree created successfully',
            data: degree,
        });
    } catch (error) {
        next(error);
    }
};

const getMyDegrees = async (req, res, next) => {
    try {
        const degrees = await degreeService.getMyDegrees(req.user.id);

        return res.status(200).json({
            success: true,
            message: 'Degrees fetched successfully',
            data: degrees,
        });
    } catch (error) {
        next(error);
    }
};

const getDegreesByProfileId = async (req, res, next) => {
    try {
        const degrees = await degreeService.getDegreesByProfileId(req.params.profileId);

        return res.status(200).json({
            success: true,
            message: 'Degrees fetched successfully',
            data: degrees,
        });
    } catch (error) {
        next(error);
    }
};

const updateDegree = async (req, res, next) => {
    try {
        const degree = await degreeService.updateDegree(
            req.user.id,
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: 'Degree updated successfully',
            data: degree,
        });
    } catch (error) {
        next(error);
    }
};

const deleteDegree = async (req, res, next) => {
    try {
        await degreeService.deleteDegree(req.user.id, req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Degree deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createDegree,
    getMyDegrees,
    getDegreesByProfileId,
    updateDegree,
    deleteDegree,
};