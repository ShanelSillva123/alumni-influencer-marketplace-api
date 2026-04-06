const express = require('express');
const router = express.Router();

const certificationController = require('../controllers/certification.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const {
    createCertification,
    updateCertification,
    certificationIdParam,
    profileIdParam,
} = require('../utils/validators');

router.post(
    '/',
    authMiddleware,
    validate(createCertification),
    certificationController.createCertification
);

router.get(
    '/my',
    authMiddleware,
    certificationController.getMyCertifications
);

router.get(
    '/profile/:profileId',
    validate(profileIdParam, 'params'),
    certificationController.getCertificationsByProfileId
);

router.patch(
    '/:id',
    authMiddleware,
    validate(certificationIdParam, 'params'),
    validate(updateCertification),
    certificationController.updateCertification
);

router.delete(
    '/:id',
    authMiddleware,
    validate(certificationIdParam, 'params'),
    certificationController.deleteCertification
);

module.exports = router;