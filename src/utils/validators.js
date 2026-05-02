const Joi = require('joi');

const createProfile = Joi.object({
    fullName: Joi.string().trim().min(2).max(100).required(),

    biography: Joi.string().trim().max(2000).allow('', null),

    linkedInUrl: Joi.string().uri().allow('', null),

    profileImageUrl: Joi.string().uri().allow('', null),

    currentJobTitle: Joi.string().trim().max(150).allow('', null),

    currentCompany: Joi.string().trim().max(150).allow('', null),
});

const updateProfile = Joi.object({
    fullName: Joi.string().trim().min(2).max(100),

    biography: Joi.string().trim().max(2000).allow('', null),

    linkedInUrl: Joi.string().uri().allow('', null),

    profileImageUrl: Joi.string().uri().allow('', null),

    currentJobTitle: Joi.string().trim().max(150).allow('', null),

    currentCompany: Joi.string().trim().max(150).allow('', null),
})
    .min(1)
    .messages({
        'object.min': 'At least one field must be provided for update',
    });

/* =========================
   DEGREE VALIDATORS
========================= */

const createDegree = Joi.object({
    title: Joi.string().trim().min(2).max(150).required(),
    institutionName: Joi.string().trim().min(2).max(150).required(),
    degreeUrl: Joi.string().uri().allow("", null),
    completionDate: Joi.date().iso().allow(null),
});

const updateDegree = Joi.object({
    title: Joi.string().trim().min(2).max(150),
    institutionName: Joi.string().trim().min(2).max(150),
    degreeUrl: Joi.string().uri().allow("", null),
    completionDate: Joi.date().iso().allow(null),
})
    .min(1)
    .messages({
        "object.min": "At least one field must be provided for update",
    });

const degreeIdParam = Joi.object({
    id: Joi.string().uuid().required(),
});

const profileIdParam = Joi.object({
    profileId: Joi.string().uuid().required(),
});

const createEmployment = Joi.object({
    companyName: Joi.string().trim().min(2).max(150).required(),
    jobTitle: Joi.string().trim().min(2).max(150).required(),
    employmentType: Joi.string()
        .trim()
        .valid(
            'FULL_TIME',
            'PART_TIME',
            'CONTRACT',
            'INTERNSHIP',
            'FREELANCE',
            'TEMPORARY',
            'VOLUNTEER',
            'OTHER'
        )
        .allow('', null),
    location: Joi.string().trim().max(150).allow('', null),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().allow(null),
    isCurrent: Joi.boolean().optional(),
    description: Joi.string().trim().max(2000).allow('', null),
});

const updateEmployment = Joi.object({
    companyName: Joi.string().trim().min(2).max(150),
    jobTitle: Joi.string().trim().min(2).max(150),
    employmentType: Joi.string()
        .trim()
        .valid(
            'FULL_TIME',
            'PART_TIME',
            'CONTRACT',
            'INTERNSHIP',
            'FREELANCE',
            'TEMPORARY',
            'VOLUNTEER',
            'OTHER'
        )
        .allow('', null),
    location: Joi.string().trim().max(150).allow('', null),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().allow(null),
    isCurrent: Joi.boolean(),
    description: Joi.string().trim().max(2000).allow('', null),
})
    .min(1)
    .messages({
        'object.min': 'At least one field must be provided for update',
    });

const employmentIdParam = Joi.object({
    id: Joi.string().uuid().required(),
});

const createCertification = Joi.object({
    title: Joi.string().trim().min(2).max(150).required(),
    providerName: Joi.string().trim().min(2).max(150).required(),
    courseUrl: Joi.string().uri().allow('', null),
    completionDate: Joi.date().iso().allow(null),
});

const updateCertification = Joi.object({
    title: Joi.string().trim().min(2).max(150),
    providerName: Joi.string().trim().min(2).max(150),
    courseUrl: Joi.string().uri().allow('', null),
    completionDate: Joi.date().iso().allow(null),
})
    .min(1)
    .messages({
        'object.min': 'At least one field must be provided for update',
    });

const certificationIdParam = Joi.object({
    id: Joi.string().uuid().required(),
});

const createCourse = Joi.object({
    title: Joi.string().trim().min(2).max(150).required(),
    providerName: Joi.string().trim().min(2).max(150).required(),
    courseUrl: Joi.string().uri().allow('', null),
    completionDate: Joi.date().iso().allow(null),
});

const updateCourse = Joi.object({
    title: Joi.string().trim().min(2).max(150),
    providerName: Joi.string().trim().min(2).max(150),
    courseUrl: Joi.string().uri().allow('', null),
    completionDate: Joi.date().iso().allow(null),
})
    .min(1)
    .messages({
        'object.min': 'At least one field must be provided for update',
    });

const courseIdParam = Joi.object({
    id: Joi.string().uuid().required(),
});

const createLicence = Joi.object({
    title: Joi.string().trim().min(2).max(150).required(),
    awardingBody: Joi.string().trim().min(2).max(150).required(),
    awardingBodyUrl: Joi.string().uri().allow('', null),
    completionDate: Joi.date().iso().allow(null),
});

const updateLicence = Joi.object({
    title: Joi.string().trim().min(2).max(150),
    awardingBody: Joi.string().trim().min(2).max(150),
    awardingBodyUrl: Joi.string().uri().allow('', null),
    completionDate: Joi.date().iso().allow(null),
})
    .min(1)
    .messages({
        'object.min': 'At least one field must be provided for update',
    });

const licenceIdParam = Joi.object({
    id: Joi.string().uuid().required(),
});
const createBid = Joi.object({
    amount: Joi.number().positive().precision(2).required(),
});

const updateBid = Joi.object({
    amount: Joi.number().positive().precision(2).required(),
})
    .min(1)
    .messages({
        'object.min': 'At least one field must be provided for update',
    });

const bidIdParam = Joi.object({
    id: Joi.string().uuid().required(),
});

const createNotification = Joi.object({
    title: Joi.string().trim().min(2).max(150).required(),
    message: Joi.string().trim().min(2).max(2000).required(),
    type: Joi.string()
        .valid(
            'BID_CREATED',
            'BID_UPDATED',
            'BID_CANCELLED',
            'BID_WON',
            'BID_LOST'
        )
        .required(),
});

const notificationIdParam = Joi.object({
    id: Joi.string().uuid().required(),
});

const createApiKey = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
});

const apiKeyIdParam = Joi.object({
    id: Joi.string().uuid().required(),
});

const updateApiKeyPermissions = Joi.object({
    permissions: Joi.array()
        .items(
            Joi.string().valid(
                'read:alumni',
                'read:analytics',
                'read:alumni_of_day'
            )
        )
        .min(1)
        .required(),
});


module.exports = {
    createProfile,
    updateProfile,
    createDegree,
    updateDegree,
    degreeIdParam,
    profileIdParam,
    createEmployment,
    updateEmployment,
    employmentIdParam,
    createCertification,
    updateCertification,
    certificationIdParam,
    createCourse,
    updateCourse,
    courseIdParam,
    createLicence,
    updateLicence,
    licenceIdParam,
    createBid,
    updateBid,
    bidIdParam,
    createNotification,
    notificationIdParam,
    createApiKey,
    apiKeyIdParam,
    updateApiKeyPermissions

};