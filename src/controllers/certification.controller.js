const certificationService = require("../services/certification.service");

const createCertification = async (req, res, next) => {
    try {
        const certification = await certificationService.createCertification(
            req.user.id,
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Certification created successfully",
            data: certification,
        });
    } catch (error) {
        next(error);
    }
};

const getMyCertifications = async (req, res, next) => {
    try {
        const certifications = await certificationService.getMyCertifications(
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message: "Certifications fetched successfully",
            data: certifications,
        });
    } catch (error) {
        next(error);
    }
};

const getCertificationsByProfileId = async (req, res, next) => {
    try {
        const certifications =
            await certificationService.getCertificationsByProfileId(
                req.params.profileId
            );

        return res.status(200).json({
            success: true,
            message: "Certifications fetched successfully",
            data: certifications,
        });
    } catch (error) {
        next(error);
    }
};

const updateCertification = async (req, res, next) => {
    try {
        const certification = await certificationService.updateCertification(
            req.user.id,
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Certification updated successfully",
            data: certification,
        });
    } catch (error) {
        next(error);
    }
};

const deleteCertification = async (req, res, next) => {
    try {
        await certificationService.deleteCertification(req.user.id, req.params.id);

        return res.status(200).json({
            success: true,
            message: "Certification deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCertification,
    getMyCertifications,
    getCertificationsByProfileId,
    updateCertification,
    deleteCertification,
};