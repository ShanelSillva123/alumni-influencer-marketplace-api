const biddingRepository = require('../repositories/bidding.repository');
const authRepository = require('../repositories/auth.repository');

const getTomorrowBidDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
};

const ensureUserExists = async (userId) => {
    const user = await authRepository.findUserById(userId);

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    return user;
};

const ensureBidExistsForUser = async (userId, bidId) => {
    const bid = await biddingRepository.findBidByIdAndUserId(bidId, userId);

    if (!bid) {
        const error = new Error('Bid not found');
        error.statusCode = 404;
        throw error;
    }

    return bid;
};

const createBid = async (userId, payload) => {
    await ensureUserExists(userId);

    return biddingRepository.createBid({
        userId,
        bidDate: getTomorrowBidDate(),
        amount: payload.amount,
        status: 'PENDING',
        isActive: true,
    });
};

const getMyBids = async (userId) => {
    await ensureUserExists(userId);
    return biddingRepository.findBidsByUserId(userId);
};

const getMyActiveBids = async (userId) => {
    await ensureUserExists(userId);
    return biddingRepository.findActiveBidsByUserId(userId);
};

const getBidById = async (userId, bidId) => {
    return ensureBidExistsForUser(userId, bidId);
};

const updateBid = async (userId, bidId, payload) => {
    const existingBid = await ensureBidExistsForUser(userId, bidId);

    if (!existingBid.isActive || existingBid.status === 'CANCELLED') {
        const error = new Error('Cancelled or inactive bids cannot be updated');
        error.statusCode = 400;
        throw error;
    }

    if (existingBid.status === 'WON' || existingBid.status === 'LOST') {
        const error = new Error('Finalized bids cannot be updated');
        error.statusCode = 400;
        throw error;
    }

    if (payload.amount !== undefined) {
        if (Number(payload.amount) <= Number(existingBid.amount)) {
            const error = new Error('Bid amount must be higher than current amount');
            error.statusCode = 400;
            throw error;
        }
    }

    const updateData = {};

    if (payload.amount !== undefined) {
        updateData.amount = payload.amount;
    }

    return biddingRepository.updateBid(bidId, updateData);
};

const deactivateBid = async (userId, bidId) => {
    const existingBid = await ensureBidExistsForUser(userId, bidId);

    if (!existingBid.isActive || existingBid.status === 'CANCELLED') {
        return existingBid;
    }

    if (existingBid.status === 'WON' || existingBid.status === 'LOST') {
        const error = new Error('Finalized bids cannot be cancelled');
        error.statusCode = 400;
        throw error;
    }

    return biddingRepository.updateBid(bidId, {
        isActive: false,
        status: 'CANCELLED',
    });
};

const deleteBid = async (userId, bidId) => {
    await ensureBidExistsForUser(userId, bidId);
    return biddingRepository.deleteBid(bidId);
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