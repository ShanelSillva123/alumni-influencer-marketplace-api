const express = require('express');
const router = express.Router();

const publicCertificationRoutes = require('./public.routes');
// add others later (degrees, employment, etc.)

router.use('/', publicCertificationRoutes);

module.exports = router;