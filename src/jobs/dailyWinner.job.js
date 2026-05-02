const prisma = require("../models/prisma");

const getTomorrowDateOnly = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
};

module.exports = async () => {
    try {
        const bids = await prisma.bid.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                amount: "desc",
            },
        });

        if (!bids.length) {
            console.log("Daily Winner Job: No active bids found.");

            return {
                winner: null,
                lostCount: 0,
                message: "No active bids found.",
            };
        }

        const winningBid = bids[0];
        const losingBids = bids.slice(1);
        const losingIds = losingBids.map((bid) => bid.id);

        const updatedWinner = await prisma.bid.update({
            where: { id: winningBid.id },
            data: {
                status: "WON",
                isActive: false,
            },
        });

        await prisma.notification.create({
            data: {
                userId: winningBid.userId,
                title: "You won the bid!",
                message: "Your bid has been selected as the winning bid.",
                type: "WINNER_ANNOUNCEMENT",
            },
        });

        if (losingIds.length > 0) {
            await prisma.bid.updateMany({
                where: {
                    id: { in: losingIds },
                },
                data: {
                    status: "LOST",
                    isActive: false,
                },
            });

            await prisma.notification.createMany({
                data: losingBids.map((bid) => ({
                    userId: bid.userId,
                    title: "Bid result",
                    message: "Your bid was not selected this time.",
                    type: "BID_STATUS",
                })),
            });
        }

        const featuredDate = getTomorrowDateOnly();

        const featuredAlumnus = await prisma.featuredAlumnusDaily.upsert({
            where: {
                featuredDate,
            },
            update: {
                userId: winningBid.userId,
                bidId: winningBid.id,
            },
            create: {
                userId: winningBid.userId,
                bidId: winningBid.id,
                featuredDate,
            },
        });

        console.log("Daily winner selected:", winningBid.id);

        return {
            winner: updatedWinner,
            featuredAlumnus,
            lostCount: losingIds.length,
            message: "Daily winner selected and featured alumnus created successfully.",
        };
    } catch (error) {
        console.error("Daily Winner Job Error:", error);
        throw error;
    }
};