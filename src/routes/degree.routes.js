const express = require('express');
const router = express.Router();

const degreeController = require('../controllers/degree.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const {
    createDegree,
    updateDegree,
    degreeIdParam,
    profileIdParam,
} = require('../utils/validators');

/* =========================
   DEGREE ROUTES
========================= */

/**
 * @route   POST /api/degrees
 * @desc    Create a degree (own profile)
 * @access  Private
 */
router.post(
    '/',
    authMiddleware,
    validate(createDegree),
    degreeController.createDegree
);

/**
 * @route   GET /api/degrees/my
 * @desc    Get logged-in user's degrees
 * @access  Private
 */
router.get(
    '/my',
    authMiddleware,
    degreeController.getMyDegrees
);

/**
 * @route   GET /api/degrees/profile/:profileId
 * @desc    Get degrees by profile ID
 * @access  Public
 */
router.get(
    '/profile/:profileId',
    validate(profileIdParam, 'params'),
    degreeController.getDegreesByProfileId
);

/**
 * @route   PATCH /api/degrees/:id
 * @desc    Update a degree (own)
 * @access  Private
 */
router.patch(
    '/:id',
    authMiddleware,
    validate(degreeIdParam, 'params'),
    validate(updateDegree),
    degreeController.updateDegree
);

/**
 * @route   DELETE /api/degrees/:id
 * @desc    Delete a degree (own)
 * @access  Private
 */
router.delete(
    '/:id',
    authMiddleware,
    validate(degreeIdParam, 'params'),
    degreeController.deleteDegree
);

module.exports = router;