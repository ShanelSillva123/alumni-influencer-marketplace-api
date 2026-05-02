const biddingRepository = require('../repositories/bidding.repository');
const authRepository = require('../repositories/auth.repository');
const prisma = require('../models/prisma');

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

const ensureMonthlyWinLimitNotExceeded = async (userId) => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const monthlyWins = await prisma.bid.count({
        where: {
            userId,
            status: 'WON',
            updatedAt: {
                gte: startOfMonth,
                lt: endOfMonth,
            },
        },
    });

    if (monthlyWins >= 3) {
        const error = new Error(
            'Monthly bidding limit reached. You can only win 3 featured slots per month.'
        );
        error.statusCode = 403;
        throw error;
    }
};

const createBid = async (userId, payload) => {
    await ensureUserExists(userId);
    await ensureMonthlyWinLimitNotExceeded(userId);

    const bid = await biddingRepository.createBid({
        userId,
        bidDate: getTomorrowBidDate(),
        amount: payload.amount,
        status: 'PENDING',
        isActive: true,
    });

    await prisma.notification.create({
        data: {
            userId,
            title: 'Bid placed',
            message: `Your bid of £${payload.amount} has been placed successfully.`,
            type: 'BID_STATUS',
        },
    });

    return bid;
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

    const updatedBid = await biddingRepository.updateBid(bidId, updateData);

    if (payload.amount !== undefined) {
        await prisma.notification.create({
            data: {
                userId,
                title: 'Bid updated',
                message: `Your bid has been updated to £${payload.amount}.`,
                type: 'BID_STATUS',
            },
        });
    }

    return updatedBid;
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

    const updatedBid = await biddingRepository.updateBid(bidId, {
        isActive: false,
        status: 'CANCELLED',
    });

    await prisma.notification.create({
        data: {
            userId,
            title: 'Bid deactivated',
            message: 'Your bid has been successfully deactivated.',
            type: 'BID_STATUS',
        },
    });

    return updatedBid;
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