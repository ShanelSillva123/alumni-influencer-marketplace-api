const express = require('express');
const router = express.Router();

const apiKeyController = require('../controllers/apiKey.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const {
    createApiKey,
    apiKeyIdParam,
} = require('../utils/validators');

router.post(
    '/',
    authMiddleware,
    validate(createApiKey),
    apiKeyController.createApiKey
);

router.get(
    '/my',
    authMiddleware,
    apiKeyController.getMyApiKeys
);

router.get(
    '/my/active',
    authMiddleware,
    apiKeyController.getMyActiveApiKeys
);

router.patch(
    '/:id/revoke',
    authMiddleware,
    validate(apiKeyIdParam, 'params'),
    apiKeyController.revokeApiKey
);

router.delete(
    '/:id',
    authMiddleware,
    validate(apiKeyIdParam, 'params'),
    apiKeyController.deleteApiKey
);

module.exports = router;