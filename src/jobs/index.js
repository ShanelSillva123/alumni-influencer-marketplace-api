const cron = require('node-cron');

const dailyWinnerJob = require('./dailyWinner.job');
const monthlyResetJob = require('./monthlyReset.job');
const tokenCleanupJob = require('./tokenCleanup.job');

const startJobs = () => {
    // Run every day at midnight
    cron.schedule('0 0 * * *', async () => {
        console.log('Running Daily Winner Job...');
        await dailyWinnerJob();
    });

    // Run on 1st of every month
    cron.schedule('0 0 1 * *', async () => {
        console.log('Running Monthly Reset Job...');
        await monthlyResetJob();
    });

    // Run every hour
    cron.schedule('0 * * * *', async () => {
        console.log('Running Token Cleanup Job...');
        await tokenCleanupJob();
    });
};

module.exports = startJobs;