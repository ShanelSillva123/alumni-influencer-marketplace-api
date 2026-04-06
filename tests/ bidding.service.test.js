jest.mock('../src/repositories/bidding.repository', () => ({
    findBidByIdAndUserId: jest.fn(),
    updateBid: jest.fn(),
    createBid: jest.fn(),
    findBidsByUserId: jest.fn(),
    findActiveBidsByUserId: jest.fn(),
    deleteBid: jest.fn(),
}));

jest.mock('../src/repositories/auth.repository', () => ({
    findUserById: jest.fn(),
}));

const biddingRepository = require('../src/repositories/bidding.repository');
const authRepository = require('../src/repositories/auth.repository');
const biddingService = require('../src/services/bidding.service');

describe('Bidding Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createBid', () => {
        it('should throw 404 if user does not exist', async () => {
            authRepository.findUserById.mockResolvedValue(null);

            await expect(
                biddingService.createBid('user-1', { amount: 200 })
            ).rejects.toMatchObject({
                message: 'User not found',
                statusCode: 404,
            });
        });

        it('should create a bid if user exists', async () => {
            authRepository.findUserById.mockResolvedValue({
                id: 'user-1',
                email: 'test@example.com',
            });

            biddingRepository.createBid.mockResolvedValue({
                id: 'bid-1',
                userId: 'user-1',
                amount: 200,
                status: 'PENDING',
                isActive: true,
            });

            const result = await biddingService.createBid('user-1', { amount: 200 });

            expect(biddingRepository.createBid).toHaveBeenCalled();
            expect(result).toHaveProperty('id', 'bid-1');
        });
    });

    describe('updateBid', () => {
        it('should throw 404 if bid does not exist', async () => {
            biddingRepository.findBidByIdAndUserId.mockResolvedValue(null);

            await expect(
                biddingService.updateBid('user-1', 'bid-1', { amount: 500 })
            ).rejects.toMatchObject({
                message: 'Bid not found',
                statusCode: 404,
            });
        });

        it('should reject lower or equal bid amount', async () => {
            biddingRepository.findBidByIdAndUserId.mockResolvedValue({
                id: 'bid-1',
                userId: 'user-1',
                amount: 500,
                isActive: true,
                status: 'PENDING',
            });

            await expect(
                biddingService.updateBid('user-1', 'bid-1', { amount: 500 })
            ).rejects.toMatchObject({
                message: 'Bid amount must be higher than current amount',
                statusCode: 400,
            });
        });

        it('should update bid if new amount is higher', async () => {
            biddingRepository.findBidByIdAndUserId.mockResolvedValue({
                id: 'bid-1',
                userId: 'user-1',
                amount: 500,
                isActive: true,
                status: 'PENDING',
            });

            biddingRepository.updateBid.mockResolvedValue({
                id: 'bid-1',
                amount: 700,
            });

            const result = await biddingService.updateBid('user-1', 'bid-1', {
                amount: 700,
            });

            expect(biddingRepository.updateBid).toHaveBeenCalledWith('bid-1', {
                amount: 700,
            });
            expect(result.amount).toBe(700);
        });
    });
});