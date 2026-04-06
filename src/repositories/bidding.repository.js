const prisma = require('../models/prisma');

const createBid = async (data) => {
    return prisma.bid.create({
        data,
    });
};

const findBidsByUserId = async (userId) => {
    return prisma.bid.findMany({
        where: { userId },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

const findActiveBidsByUserId = async (userId) => {
    return prisma.bid.findMany({
        where: {
            userId,
            isActive: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

const findBidById = async (id) => {
    return prisma.bid.findUnique({
        where: { id },
    });
};

const findBidByIdAndUserId = async (id, userId) => {
    return prisma.bid.findFirst({
        where: {
            id,
            userId,
        },
    });
};

const updateBid = async (id, data) => {
    return prisma.bid.update({
        where: { id },
        data,
    });
};

const deleteBid = async (id) => {
    return prisma.bid.delete({
        where: { id },
    });
};

const deactivateBid = async (id) => {
    return prisma.bid.update({
        where: { id },
        data: {
            isActive: false,
            status: 'CANCELLED',
        },
    });
};

module.exports = {
    createBid,
    findBidsByUserId,
    findActiveBidsByUserId,
    findBidById,
    findBidByIdAndUserId,
    updateBid,
    deleteBid,
    deactivateBid,
};