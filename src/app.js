const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const routes = require('./routes');
const publicRoutes = require('./routes/public.index');
const { swaggerUi, swaggerDocument } = require('./config/swagger');

const {
    apiLimiter,
    authLimiter,
    apiKeyLimiter,
} = require('./middleware/rateLimit.middleware');

const sanitizeMiddleware = require('./middleware/sanitize.middleware');

const notFoundMiddleware = require('./middleware/notFound.middleware');
const errorMiddleware = require('./middleware/error.middleware');
const startJobs = require('./jobs');

const app = express();

// 🔐 Security Headers
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
);

// 🔐 CORS (restricted)
app.use(
    cors({
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        credentials: true,
    })
);

// 📄 Logging
app.use(morgan('dev'));

// 🔐 Body size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 🔐 Sanitization
app.use(sanitizeMiddleware);

// 🔹 Health check
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Alumni Influencer Marketplace API is running',
    });
});

// 🔹 Public routes
app.use('/api/public', publicRoutes);

// 🔹 Auth routes (STRICT rate limit)
app.use('/api/auth', authLimiter, require('./routes/auth.routes'));

app.use('/api/api-keys', apiKeyLimiter, require('./routes/apiKey.routes'));

app.use('/api', apiLimiter, routes);

// 📘 Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(notFoundMiddleware);

app.use(errorMiddleware);

startJobs();

module.exports = app;