const express = require("express");
const router = express.Router();

const publicController = require("../controllers/public.controller");
const requireApiKeyPermission = require("../middleware/apiKeyAuth.middleware");

router.get(
    "/profiles/:profileId/certifications",
    requireApiKeyPermission("read:alumni"),
    publicController.getCertificationsByProfileId
);

router.get(
    "/alumni-of-day",
    requireApiKeyPermission("read:alumni_of_day"),
    publicController.getAlumniOfTheDay
);

module.exports = router;