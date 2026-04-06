jest.mock('../src/repositories/profile.repository', () => ({
    findProfileByUserId: jest.fn(),
    findProfileById: jest.fn(),
    createProfile: jest.fn(),
    listProfiles: jest.fn(),
    updateProfileByUserId: jest.fn(),
    deleteProfileByUserId: jest.fn(),
}));

const profileRepository = require('../src/repositories/profile.repository');
const profileService = require('../src/services/profile.service');

describe('Profile Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createProfile', () => {
        it('should throw 409 if profile already exists', async () => {
            profileRepository.findProfileByUserId.mockResolvedValue({
                id: 'profile-1',
                userId: 'user-1',
            });

            await expect(
                profileService.createProfile('user-1', {
                    fullName: 'Shanel Silva',
                })
            ).rejects.toMatchObject({
                message: 'Profile already exists for this user',
                statusCode: 409,
            });
        });

        it('should create profile if one does not exist', async () => {
            profileRepository.findProfileByUserId.mockResolvedValue(null);
            profileRepository.createProfile.mockResolvedValue({
                id: 'profile-1',
                userId: 'user-1',
                fullName: 'Shanel Silva',
                profileCompletenessScore: 17,
            });

            const result = await profileService.createProfile('user-1', {
                fullName: 'Shanel Silva',
            });

            expect(profileRepository.createProfile).toHaveBeenCalled();
            expect(result).toHaveProperty('id', 'profile-1');
        });
    });

    describe('getMyProfile', () => {
        it('should throw 404 if profile not found', async () => {
            profileRepository.findProfileByUserId.mockResolvedValue(null);

            await expect(profileService.getMyProfile('user-1')).rejects.toMatchObject({
                message: 'Profile not found',
                statusCode: 404,
            });
        });

        it('should return profile if found', async () => {
            profileRepository.findProfileByUserId.mockResolvedValue({
                id: 'profile-1',
                userId: 'user-1',
                fullName: 'Shanel Silva',
            });

            const result = await profileService.getMyProfile('user-1');

            expect(result).toHaveProperty('fullName', 'Shanel Silva');
        });
    });

    describe('updateMyProfile', () => {
        it('should throw 404 if profile not found', async () => {
            profileRepository.findProfileByUserId.mockResolvedValue(null);

            await expect(
                profileService.updateMyProfile('user-1', {
                    currentCompany: 'ABC Ltd',
                })
            ).rejects.toMatchObject({
                message: 'Profile not found',
                statusCode: 404,
            });
        });

        it('should update profile if found', async () => {
            profileRepository.findProfileByUserId.mockResolvedValue({
                id: 'profile-1',
                userId: 'user-1',
                fullName: 'Shanel Silva',
                biography: null,
            });

            profileRepository.updateProfileByUserId.mockResolvedValue({
                id: 'profile-1',
                userId: 'user-1',
                fullName: 'Shanel Silva',
                currentCompany: 'ABC Ltd',
            });

            const result = await profileService.updateMyProfile('user-1', {
                currentCompany: 'ABC Ltd',
            });

            expect(profileRepository.updateProfileByUserId).toHaveBeenCalled();
            expect(result).toHaveProperty('currentCompany', 'ABC Ltd');
        });
    });
});