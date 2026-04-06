const courseService = require('../services/course.service');

const createCourse = async (req, res, next) => {
    try {
        const course = await courseService.createCourse(req.user.id, req.body);

        return res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

const getMyCourses = async (req, res, next) => {
    try {
        const courses = await courseService.getMyCourses(req.user.id);

        return res.status(200).json({
            success: true,
            message: 'Courses fetched successfully',
            data: courses,
        });
    } catch (error) {
        next(error);
    }
};

const getCoursesByProfileId = async (req, res, next) => {
    try {
        const courses = await courseService.getCoursesByProfileId(req.params.profileId);

        return res.status(200).json({
            success: true,
            message: 'Courses fetched successfully',
            data: courses,
        });
    } catch (error) {
        next(error);
    }
};

const updateCourse = async (req, res, next) => {
    try {
        const course = await courseService.updateCourse(
            req.user.id,
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

const deleteCourse = async (req, res, next) => {
    try {
        await courseService.deleteCourse(req.user.id, req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Course deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCourse,
    getMyCourses,
    getCoursesByProfileId,
    updateCourse,
    deleteCourse,
};