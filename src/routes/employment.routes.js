const express = require('express');
const router = express.Router();

const employmentController = require('../controllers/employment.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const {
    createEmployment,
    updateEmployment,
    employmentIdParam,
    profileIdParam,
} = require('../utils/validators');

router.post(
    '/',
    authMiddleware,
    validate(createEmployment),
    employmentController.createEmployment
);

router.get(
    '/my',
    authMiddleware,
    employmentController.getMyEmployments
);

router.get(
    '/profile/:profileId',
    validate(profileIdParam, 'params'),
    employmentController.getEmploymentsByProfileId
);

router.patch(
    '/:id',
    authMiddleware,
    validate(employmentIdParam, 'params'),
    validate(updateEmployment),
    employmentController.updateEmployment
);

router.delete(
    '/:id',
    authMiddleware,
    validate(employmentIdParam, 'params'),
    employmentController.deleteEmployment
);

module.exports = router;