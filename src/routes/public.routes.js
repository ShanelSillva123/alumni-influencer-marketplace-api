const express = require("express");
const router = express.Router();

const publicController = require("../controllers/public.controller");
const requireApiKeyPermission = require("../middleware/apiKeyAuth.middleware");

router.get(
    "/profiles/:profileId/certifications",
    requireApiKeyPermission("read:alumni"),
    publicController.getCertificationsByProfileId
);

module.exports = router;