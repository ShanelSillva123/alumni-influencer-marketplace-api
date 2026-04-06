const express = require('express');
const router = express.Router();

const biddingController = require('../controllers/bidding.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const {
    createBid,
    updateBid,
    bidIdParam,
} = require('../utils/validators');

router.post(
    '/',
    authMiddleware,
    validate(createBid),
    biddingController.createBid
);

router.get(
    '/my',
    authMiddleware,
    biddingController.getMyBids
);

router.get(
    '/my/active',
    authMiddleware,
    biddingController.getMyActiveBids
);

router.get(
    '/:id',
    authMiddleware,
    validate(bidIdParam, 'params'),
    biddingController.getBidById
);

router.patch(
    '/:id',
    authMiddleware,
    validate(bidIdParam, 'params'),
    validate(updateBid),
    biddingController.updateBid
);

router.patch(
    '/:id/deactivate',
    authMiddleware,
    validate(bidIdParam, 'params'),
    biddingController.deactivateBid
);

router.delete(
    '/:id',
    authMiddleware,
    validate(bidIdParam, 'params'),
    biddingController.deleteBid
);

module.exports = router;