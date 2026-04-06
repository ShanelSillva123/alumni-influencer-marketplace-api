const employmentService = require('../services/employment.service');

const createEmployment = async (req, res, next) => {
    try {
        const employment = await employmentService.createEmployment(
            req.user.id,
            req.body
        );

        return res.status(201).json({
            success: true,
            message: 'Employment history created successfully',
            data: employment,
        });
    } catch (error) {
        next(error);
    }
};

const getMyEmployments = async (req, res, next) => {
    try {
        const employments = await employmentService.getMyEmployments(req.user.id);

        return res.status(200).json({
            success: true,
            message: 'Employment history fetched successfully',
            data: employments,
        });
    } catch (error) {
        next(error);
    }
};

const getEmploymentsByProfileId = async (req, res, next) => {
    try {
        const employments = await employmentService.getEmploymentsByProfileId(
            req.params.profileId
        );

        return res.status(200).json({
            success: true,
            message: 'Employment history fetched successfully',
            data: employments,
        });
    } catch (error) {
        next(error);
    }
};

const updateEmployment = async (req, res, next) => {
    try {
        const employment = await employmentService.updateEmployment(
            req.user.id,
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: 'Employment history updated successfully',
            data: employment,
        });
    } catch (error) {
        next(error);
    }
};

const deleteEmployment = async (req, res, next) => {
    try {
        await employmentService.deleteEmployment(req.user.id, req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Employment history deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createEmployment,
    getMyEmployments,
    getEmploymentsByProfileId,
    updateEmployment,
    deleteEmployment,
};