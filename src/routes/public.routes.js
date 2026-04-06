const express = require('express');
const router = express.Router();

const publicCertificationController = require('../controllers/publicCertification.controller');
const validate = require('../middleware/validate.middleware');

const { profileIdParam } = require('../utils/validators');

router.get(
    '/profiles/:profileId/certifications',
    validate(profileIdParam, 'params'),
    publicCertificationController.getCertificationsByProfileId
);

module.exports = router;