const prisma = require("../models/prisma");
const certificationService = require("../services/certification.service");

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

const getAlumniOfTheDay = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const featured = await prisma.featuredAlumnusDaily.findUnique({
            where: {
                featuredDate: today,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        profile: {
                            include: {
                                degrees: true,
                                certifications: true,
                                licences: true,
                                shortCourses: true,
                                employmentHistory: true,
                            },
                        },
                    },
                },
                bid: true,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Alumni of the day fetched successfully",
            data: featured,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCertificationsByProfileId,
    getAlumniOfTheDay,
};