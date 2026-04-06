const express = require('express');
const router = express.Router();

const licenceController = require('../controllers/licence.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const {
    createLicence,
    updateLicence,
    licenceIdParam,
    profileIdParam,
} = require('../utils/validators');

router.post(
    '/',
    authMiddleware,
    validate(createLicence),
    licenceController.createLicence
);

router.get(
    '/my',
    authMiddleware,
    licenceController.getMyLicences
);

router.get(
    '/profile/:profileId',
    validate(profileIdParam, 'params'),
    licenceController.getLicencesByProfileId
);

router.patch(
    '/:id',
    authMiddleware,
    validate(licenceIdParam, 'params'),
    validate(updateLicence),
    licenceController.updateLicence
);

router.delete(
    '/:id',
    authMiddleware,
    validate(licenceIdParam, 'params'),
    licenceController.deleteLicence
);

module.exports = router;