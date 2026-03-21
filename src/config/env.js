const requiredEnvVars = [
    'PORT',
    'NODE_ENV',
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_EXPIRES_IN'
];

function getEnv(name, fallback = undefined) {
    const value = process.env[name] ?? fallback;
    if (value === undefined || value === '') {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

function validateEnv() {
    requiredEnvVars.forEach((key) => {
        getEnv(key);
    });
}

module.exports = {
    getEnv,
    validateEnv
};