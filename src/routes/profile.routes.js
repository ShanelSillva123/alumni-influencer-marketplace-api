const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profile.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
    createProfile,
    updateProfile,
    profileIdParam,
} = require('../utils/validators');

router.post(
    '/',
    authMiddleware,
    validate(createProfile),
    profileController.createProfile
);

router.get(
    '/me',
    authMiddleware,
    profileController.getMyProfile
);

router.get(
    '/',
    profileController.getAllProfiles
);

router.get(
    '/:id',
    validate(profileIdParam, 'params'),
    profileController.getProfileById
);

router.patch(
    '/',
    authMiddleware,
    validate(updateProfile),
    profileController.updateMyProfile
);

router.delete(
    '/',
    authMiddleware,
    profileController.deleteMyProfile
);

module.exports = router;