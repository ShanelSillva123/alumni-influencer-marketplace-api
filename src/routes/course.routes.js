const express = require('express');
const router = express.Router();

const courseController = require('../controllers/course.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const {
    createCourse,
    updateCourse,
    courseIdParam,
    profileIdParam,
} = require('../utils/validators');

router.post(
    '/',
    authMiddleware,
    validate(createCourse),
    courseController.createCourse
);

router.get(
    '/my',
    authMiddleware,
    courseController.getMyCourses
);

router.get(
    '/profile/:profileId',
    validate(profileIdParam, 'params'),
    courseController.getCoursesByProfileId
);

router.patch(
    '/:id',
    authMiddleware,
    validate(courseIdParam, 'params'),
    validate(updateCourse),
    courseController.updateCourse
);

router.delete(
    '/:id',
    authMiddleware,
    validate(courseIdParam, 'params'),
    courseController.deleteCourse
);

module.exports = router;