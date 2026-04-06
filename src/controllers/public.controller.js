const certificationService = require('../services/certification.service');

const getCertificationsByProfileId = async (req, res, next) => {
    try {
        const certifications =
            await certificationService.getCertificationsByProfileId(
                req.params.profileId
            );

        return res.status(200).json({
            success: true,
            message: 'Certifications fetched successfully',
            data: certifications,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCertificationsByProfileId,
};