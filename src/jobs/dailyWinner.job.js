const prisma = require('../models/prisma');

module.exports = async () => {
    try {
        // Get all active bids for today
        const bids = await prisma.bid.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                amount: 'desc',
            },
        });

        if (!bids.length) return;

        const winningBid = bids[0];

        // Mark winner
        await prisma.bid.update({
            where: { id: winningBid.id },
            data: {
                status: 'WON',
                isActive: false,
            },
        });

        // Mark others as lost
        const losingIds = bids.slice(1).map(b => b.id);

        await prisma.bid.updateMany({
            where: {
                id: { in: losingIds },
            },
            data: {
                status: 'LOST',
                isActive: false,
            },
        });

        console.log('Daily winner selected:', winningBid.id);

    } catch (error) {
        console.error('Daily Winner Job Error:', error);
    }
};