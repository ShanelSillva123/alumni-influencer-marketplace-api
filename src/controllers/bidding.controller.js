const biddingService = require('../services/bidding.service');

const createBid = async (req, res, next) => {
    try {
        const bid = await biddingService.createBid(req.user.id, req.body);

        return res.status(201).json({
            success: true,
            message: 'Bid created successfully',
            data: bid,
        });
    } catch (error) {
        next(error);
    }
};

const getMyBids = async (req, res, next) => {
    try {
        const bids = await biddingService.getMyBids(req.user.id);

        return res.status(200).json({
            success: true,
            message: 'Bids fetched successfully',
            data: bids,
        });
    } catch (error) {
        next(error);
    }
};

const getMyActiveBids = async (req, res, next) => {
    try {
        const bids = await biddingService.getMyActiveBids(req.user.id);

        return res.status(200).json({
            success: true,
            message: 'Active bids fetched successfully',
            data: bids,
        });
    } catch (error) {
        next(error);
    }
};

const getBidById = async (req, res, next) => {
    try {
        const bid = await biddingService.getBidById(req.user.id, req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Bid fetched successfully',
            data: bid,
        });
    } catch (error) {
        next(error);
    }
};

const updateBid = async (req, res, next) => {
    try {
        const bid = await biddingService.updateBid(
            req.user.id,
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: 'Bid updated successfully',
            data: bid,
        });
    } catch (error) {
        next(error);
    }
};

const deactivateBid = async (req, res, next) => {
    try {
        const bid = await biddingService.deactivateBid(req.user.id, req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Bid cancelled successfully',
            data: bid,
        });
    } catch (error) {
        next(error);
    }
};

const deleteBid = async (req, res, next) => {
    try {
        await biddingService.deleteBid(req.user.id, req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Bid deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBid,
    getMyBids,
    getMyActiveBids,
    getBidById,
    updateBid,
    deactivateBid,
    deleteBid,
};