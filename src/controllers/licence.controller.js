const licenceService = require('../services/licence.service');

const createLicence = async (req, res, next) => {
    try {
        const licence = await licenceService.createLicence(req.user.id, req.body);

        return res.status(201).json({
            success: true,
            message: 'Licence created successfully',
            data: licence,
        });
    } catch (error) {
        next(error);
    }
};

const getMyLicences = async (req, res, next) => {
    try {
        const licences = await licenceService.getMyLicences(req.user.id);

        return res.status(200).json({
            success: true,
            message: 'Licences fetched successfully',
            data: licences,
        });
    } catch (error) {
        next(error);
    }
};

const getLicencesByProfileId = async (req, res, next) => {
    try {
        const licences = await licenceService.getLicencesByProfileId(req.params.profileId);

        return res.status(200).json({
            success: true,
            message: 'Licences fetched successfully',
            data: licences,
        });
    } catch (error) {
        next(error);
    }
};

const updateLicence = async (req, res, next) => {
    try {
        const licence = await licenceService.updateLicence(
            req.user.id,
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: 'Licence updated successfully',
            data: licence,
        });
    } catch (error) {
        next(error);
    }
};

const deleteLicence = async (req, res, next) => {
    try {
        await licenceService.deleteLicence(req.user.id, req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Licence deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createLicence,
    getMyLicences,
    getLicencesByProfileId,
    updateLicence,
    deleteLicence,
};